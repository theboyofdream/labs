import { nanoid } from "nanoid";
import { db } from "../db/index.js";

export async function ingestRssSource(sourceId) {
  const source = db
    .query("SELECT * FROM sources WHERE id = ? AND type = 'rss' AND active = 1")
    .get(sourceId);

  if (!source?.url) {
    return 0;
  }

  const Parser = await import("rss-parser");
  const parser = new Parser.default();
  const feed = await parser.parseURL(source.url);

  let count = 0;

  for (const item of feed.items ?? []) {
    if (!item.title || !item.contentSnippet) continue;

    if (item.link) {
      const existing = db
        .query("SELECT id FROM articles WHERE url = ? AND source_id = ?")
        .get(item.link, sourceId);
      if (existing) continue;
    }

    const id = nanoid();
    db.run(
      `INSERT INTO articles (id, source_id, title, url, content, summary, author, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sourceId,
        item.title,
        item.link ?? null,
        item.content ?? item.contentSnippet ?? "",
        item.contentSnippet?.substring(0, 500) ?? null,
        item.creator ?? null,
        item.pubDate ? new Date(item.pubDate).toISOString() : null,
      ],
    );
    count++;
  }

  return count;
}

export async function ingestAllRssSources() {
  const sources = db
    .query("SELECT id FROM sources WHERE type = 'rss' AND active = 1")
    .all();

  let total = 0;
  for (const source of sources) {
    try {
      const count = await ingestRssSource(source.id);
      total += count;
    } catch (err) {
      console.error(`Failed to ingest source ${source.id}:`, err);
    }
  }

  return total;
}
