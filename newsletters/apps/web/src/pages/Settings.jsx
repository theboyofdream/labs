import { useState, useEffect } from "preact/hooks";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export function Settings() {
  const { user } = useAuth();
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ name: "", type: "rss", url: "" });

  useEffect(() => {
    api.get("/sources").then((res) => setSources(res.data));
  }, []);

  const addSource = async (e) => {
    e.preventDefault();
    const res = await api.post("/sources", newSource);
    setSources((prev) => [...prev, res.data]);
    setNewSource({ name: "", type: "rss", url: "" });
  };

  const toggleSource = async (id) => {
    const res = await api.patch(`/sources/${id}/toggle`);
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: res.data.active } : s)),
    );
  };

  const deleteSource = async (id) => {
    await api.delete(`/sources/${id}`);
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <h1>Settings</h1>
      <section>
        <h2>Add Source</h2>
        <form onSubmit={addSource}>
          <input
            placeholder="Source name"
            value={newSource.name}
            onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
            required
          />
          <select
            value={newSource.type}
            onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
          >
            <option value="rss">RSS</option>
            <option value="email">Email</option>
          </select>
          <input
            placeholder="RSS URL"
            value={newSource.url}
            onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
          />
          <button type="submit">Add Source</button>
        </form>
      </section>
      <section>
        <h2>Your Sources</h2>
        <ul>
          {sources.map((s) => (
            <li key={s.id}>
              <span>{s.name} ({s.type})</span>
              <button type="button" onClick={() => toggleSource(s.id)}>
                {s.active ? "Pause" : "Activate"}
              </button>
              <button type="button" onClick={() => deleteSource(s.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
