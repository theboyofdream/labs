"""Shared fixtures for EGM Downloader API test suite."""
import sys
import os
import re
import pytest

os.environ.setdefault("EGM_API_TOKEN", "ci-test-token-not-secret")
sys.argv = ["app.py"]


@pytest.fixture(scope="session")
def app_module():
    """Import app.py once per session."""
    import importlib.util
    root = os.path.dirname(os.path.dirname(__file__))
    spec = importlib.util.spec_from_file_location("app", os.path.join(root, "app.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


ROOT = os.path.dirname(os.path.dirname(__file__))

def read_source(rel_path):
    return open(os.path.join(ROOT, rel_path), encoding="utf-8").read()
