import { db } from "../db/index.js";
import { ingestAllRssSources } from "../ingestion/rss.js";

export function setupCron(app) {
  const intervalMs = Number(process.env.CRON_INTERVAL_MS) || 15 * 60 * 1000;

  const run = async () => {
    console.log("[cron] Starting ingestion cycle...");

    try {
      const count = await ingestAllRssSources();
      console.log(`[cron] Ingested ${count} new articles`);
    } catch (err) {
      console.error("[cron] Ingestion failed:", err);
    }

    try {
      await sendScheduledDigests();
    } catch (err) {
      console.error("[cron] Digest sending failed:", err);
    }
  };

  run();
  setInterval(run, intervalMs);
}

async function sendScheduledDigests() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isMonday = now.getDay() === 1;

  const users = db
    .query(
      `SELECT u.id, u.email, us.digest_frequency, us.digest_time
       FROM users u
       JOIN user_settings us ON u.id = us.user_id
       WHERE us.digest_frequency != 'never'
       AND us.digest_time = ?`,
    )
    .all(currentTime);

  for (const user of users) {
    if (user.digest_frequency === "weekly" && !isMonday) continue;

    const freq = user.digest_frequency === "weekly" ? "-7 days" : "-1 day";

    const articles = db
      .query(
        `SELECT a.* FROM articles a
         JOIN sources s ON a.source_id = s.id
         WHERE s.user_id = ?
         AND a.ingested_at > datetime('now', ?)
         ORDER BY a.published_at DESC`,
      )
      .all(user.id, freq);

    if (articles.length === 0) continue;

    console.log(`[cron] Would send digest to ${user.email} with ${articles.length} articles`);
  }
}
