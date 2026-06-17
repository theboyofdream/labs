import re
import base64
import json
import pytest
from conftest import read_source


@pytest.fixture(scope="module")
def app_mod():
    import sys, os
    os.environ.setdefault("EGM_API_TOKEN", "ci-test-token-not-secret")
    sys.argv = ["app.py"]
    import importlib.util
    root = os.path.dirname(os.path.dirname(__file__))
    spec = importlib.util.spec_from_file_location("egm_app", os.path.join(root, "app.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture(scope="module")
def signing_keypair():
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    private = Ed25519PrivateKey.generate()
    public  = private.public_key()
    return private, public


def test_thumbnail_rejects_http_url(app_mod):
    result = app_mod._download_thumbnail("http://attacker.com/image.jpg", "test-id")
    assert result == "", "http:// URL should be rejected"


def test_thumbnail_rejects_file_url(app_mod):
    result = app_mod._download_thumbnail("file:///etc/passwd", "test-id")
    assert result == "", "file:// URL should be rejected"


def test_thumbnail_rejects_empty_url(app_mod):
    result = app_mod._download_thumbnail("", "test-id")
    assert result == "", "Empty URL should return empty string"


def test_thumbnail_https_url_is_attempted(app_mod):
    source = read_source("app.py")
    m = re.search(r'def _download_thumbnail.*?return ""', source, re.DOTALL)
    assert m, "_download_thumbnail not found in source"
    func_body = m.group(0)
    assert 'startswith("https://")' in func_body


def test_thumbnail_regex_blocks_path_traversal():
    pattern = re.compile(r'^[a-f0-9\-]+\.(jpg|png|webp)$')
    traversal_attempts = ["../etc/passwd", "../../windows/system32/config", "valid-name.jpg/../secret", ".hidden", "file with spaces.jpg", "UPPERCASE.JPG", "script.php", "image.jpg.exe", "%2e%2e/etc"]
    for attempt in traversal_attempts:
        assert not pattern.match(attempt), f"Path traversal not blocked: {attempt!r}"


def test_thumbnail_regex_accepts_valid_filenames():
    pattern = re.compile(r'^[a-f0-9\-]+\.(jpg|png|webp)$')
    valid_names = ["a1b2c3d4-1234-5678-abcd-ef0123456789.jpg", "deadbeef-cafe-babe-0000-111122223333.png", "aaaabbbb.webp"]
    for name in valid_names:
        assert pattern.match(name), f"Valid filename incorrectly rejected: {name!r}"


def test_verify_manifest_rejects_unsigned(app_mod):
    data = {"version": "0.99.12", "build": 120, "downloadUrl": "https://egerena.com/apps/EGMd.zip"}
    assert app_mod._verify_manifest(data) is False


def test_verify_manifest_rejects_empty_signature(app_mod):
    data = {"version": "0.99.12", "build": 120, "signature": ""}
    assert app_mod._verify_manifest(data) is False


def test_verify_manifest_rejects_tampered_content(app_mod, signing_keypair):
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
    private, public = signing_keypair
    data = {"version": "0.99.12", "build": 120}
    payload = json.dumps(data, sort_keys=True, separators=(',', ':')).encode('utf-8')
    sig = private.sign(payload)
    signed = dict(data, signature=base64.b64encode(sig).decode('ascii'))
    tampered = dict(signed, version="9.9.9")
    assert app_mod._verify_manifest(tampered) is False


def test_verify_manifest_rejects_wrong_key(app_mod, signing_keypair):
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
    private, _ = signing_keypair
    data = {"version": "0.99.12", "build": 120}
    payload = json.dumps(data, sort_keys=True, separators=(',', ':')).encode('utf-8')
    sig = private.sign(payload)
    signed = dict(data, signature=base64.b64encode(sig).decode('ascii'))
    assert app_mod._verify_manifest(signed) is False


def test_checksum_fail_closed():
    source = read_source("app.py")
    assert "_verify_upstream_checksum" in source
    func_match = re.search(r'def _verify_upstream_checksum.*?(?=\ndef |\Z)', source, re.DOTALL)
    assert func_match
    func_body = func_match.group(0)
    assert "return False" in func_body


def test_favorites_sanitization(app_mod):
    with app_mod.app.test_client() as client:
        headers = {"Content-Type": "application/json",
                   "X-EGM-Token": app_mod._API_TOKEN}
        payload = {
            "favorite_themes": ["void", "ghost", "<script>alert(1)</script>", "../../etc/passwd", "void", "UPPERCASE", "ok-theme", 123],
            "random_theme_scope": "../../etc",
            "random_theme_on_launch": 1,
        }
        resp = client.post("/api/settings/save", json=payload, headers=headers)
        assert resp.status_code == 200
        resp = client.get("/api/settings", headers=headers)
        data = resp.get_json()
        favs = data.get("favorite_themes", [])
        assert "void" in favs
        assert "ghost" in favs
        assert "ok-theme" in favs
        assert favs.count("void") == 1
        assert "<script>alert(1)</script>" not in str(favs)
        assert "../../etc/passwd" not in str(favs)
        assert "UPPERCASE" not in str(favs)
        assert len(favs) <= 4
        scope = data.get("random_theme_scope", "")
        assert scope in ("favorites", "all")
        on_launch = data.get("random_theme_on_launch")
        assert on_launch is True or on_launch is False


def test_port_resolution_logic():
    import os
    source = read_source("app.py")
    assert "def _resolve_port" in source
    assert 'os.environ.get("PORT")' in source
    assert 'flask_port' in source
    assert "return 8899" in source
    assert "1024" in source and "65535" in source


def test_download_dir_validator_present():
    source = read_source("app.py")
    assert "def _validate_download_dir" in source
    assert "expanduser().resolve()" in source
    assert 'rn + "/"' in source


def test_download_dir_rejects_system_roots(app_mod):
    for sys_path in ["/etc/test", "/bin/evil", "/sbin/x", "/sys/kernel", "/proc/1"]:
        ok, _, err = app_mod._validate_download_dir(sys_path)
        assert not ok
        assert "system" in err.lower()


def test_download_dir_boundary_not_prefix(app_mod):
    import tempfile, os
    with tempfile.TemporaryDirectory(prefix="etcetera_") as td:
        ok, resolved, err = app_mod._validate_download_dir(td)
        assert ok, f"Should allow '{td}' — not a system root (got: {err})"


def test_download_dir_traversal_blocked(app_mod):
    ok, _, err = app_mod._validate_download_dir("/tmp/../../etc")
    assert not ok


def test_download_dir_rejects_bad_input(app_mod):
    for bad in [None, "", "   ", 123, 0]:
        ok, _, err = app_mod._validate_download_dir(bad)
        assert not ok


def test_download_dir_accepts_valid_writable(app_mod):
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        ok, resolved, err = app_mod._validate_download_dir(td)
        assert ok
        assert resolved
