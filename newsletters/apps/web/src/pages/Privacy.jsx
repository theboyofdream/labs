export function Privacy() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <section>
        <h2>Data We Collect</h2>
        <p>We collect your email address and name when you sign in via Google OAuth.</p>
      </section>
      <section>
        <h2>How We Use Data</h2>
        <p>Your data is used solely to deliver newsletter digests and manage your sources.</p>
      </section>
    </div>
  );
}
