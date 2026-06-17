import { nanoid } from "nanoid";
import { db } from "../db/index.js";

export function ingestEmailMessage(sourceId, msg) {
  const source = db
    .query("SELECT * FROM sources WHERE id = ? AND type = 'email' AND active = 1")
    .get(sourceId);

  if (!source) return null;

  const id = nanoid();
  db.run(
    `INSERT INTO articles (id, source_id, title, content, summary, author, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      sourceId,
      msg.subject,
      msg.htmlBody ?? msg.textBody,
      msg.textBody?.substring(0, 500) ?? null,
      msg.from,
      msg.receivedAt.toISOString(),
    ],
  );

  return id;
}
