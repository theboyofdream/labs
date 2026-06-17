import { useState, useEffect } from "preact/hooks";
import { api } from "../services/api.js";

export function Dashboard() {
  const [sources, setSources] = useState([]);
  const [articles, setArticles] = useState([]);
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/sources"),
      api.get("/articles?pageSize=5"),
      api.get("/digests"),
    ]).then(([srcRes, artRes, digRes]) => {
      setSources(srcRes.data);
      setArticles(artRes.data);
      setDigests(digRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Sources ({sources.length})</h2>
        <ul>
          {sources.map((s) => (
            <li key={s.id}>
              {s.name} ({s.type}) - {s.active ? "Active" : "Inactive"}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Recent Articles</h2>
        <ul>
          {articles.map((a) => (
            <li key={a.id}>
              <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
              {a.author && <small> by {a.author}</small>}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Digests ({digests.length})</h2>
        <ul>
          {digests.map((d) => (
            <li key={d.id}>
              {d.title} - {d.sentAt ? `Sent ${new Date(d.sentAt).toLocaleDateString()}` : "Not sent"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
