import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

export const digestRoutes = new Elysia()
  .use(requireAuth)
  .get("/api/digests", ({ user }) => {
    const digests = db
      .query("SELECT * FROM digests WHERE user_id = ? ORDER BY created_at DESC")
      .all(user.id);

    return {
      ok: true,
      data: digests.map((d) => ({
        ...d,
        articleIds: JSON.parse(d.article_ids),
      })),
    };
  })
  .post("/api/digests/generate", async ({ user, body, error }) => {
    const freq = body.frequency;

    const query = freq
      ? `SELECT a.* FROM articles a
         JOIN sources s ON a.source_id = s.id
         WHERE s.user_id = ?
         AND a.ingested_at > datetime('now', ?)
         ORDER BY a.published_at DESC`
      : `SELECT a.* FROM articles a
         JOIN sources s ON a.source_id = s.id
         WHERE s.user_id = ?
         ORDER BY a.published_at DESC
         LIMIT 10`;

    const params = freq
      ? [user.id, freq === "weekly" ? "-7 days" : "-1 day"]
      : [user.id];

    const articles = db.query(query).all(...params);

    if (articles.length === 0) {
      return error(404, { ok: false, error: "No articles to digest" });
    }

    const id = nanoid();
    const articleIds = articles.map((a) => a.id);
    const title = `Digest - ${new Date().toLocaleDateString()}`;

    db.run("INSERT INTO digests (id, user_id, title, article_ids) VALUES (?, ?, ?, ?)", [
      id,
      user.id,
      title,
      JSON.stringify(articleIds),
    ]);

    await sendDigestEmail(user.email, title, articles);

    db.run("UPDATE digests SET sent_at = datetime('now') WHERE id = ?", [id]);

    return {
      ok: true,
      data: {
        id,
        userId: user.id,
        title,
        articleIds,
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    };
  })
  .get("/api/digests/:id", async ({ params, user, error }) => {
    const digest = db
      .query("SELECT * FROM digests WHERE id = ? AND user_id = ?")
      .get(params.id, user.id);

    if (!digest) {
      return error(404, { ok: false, error: "Digest not found" });
    }

    const articleIds = JSON.parse(digest.article_ids);
    const placeholders = articleIds.map(() => "?").join(",");
    const articles = db
      .query(`SELECT * FROM articles WHERE id IN (${placeholders})`)
      .all(...articleIds);

    return { ok: true, data: { ...digest, articleIds, articles } };
  });

async function sendDigestEmail(email, title, articles) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <h1>${title}</h1>
    <ul>
      ${articles
        .map(
          (a) => `
        <li>
          <a href="${a.url ?? "#"}">${a.title}</a>
          ${a.summary ? `<p>${a.summary}</p>` : ""}
          ${a.author ? `<small>By ${a.author}</small>` : ""}
        </li>`,
        )
        .join("")}
    </ul>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@newsletters.app",
    to: email,
    subject: title,
    html,
  });
}
