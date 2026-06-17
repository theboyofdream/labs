export function Terms() {
  return (
    <div>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <section>
        <h2>Use of Service</h2>
        <p>This service aggregates content from RSS feeds and email sources you configure.</p>
      </section>
      <section>
        <h2>Limitations</h2>
        <p>We are not responsible for the content ingested from third-party sources.</p>
      </section>
    </div>
  );
}
