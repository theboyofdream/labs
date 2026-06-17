const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const entries = require("./passwords.js");

function pickMessage(entry) {
  return entry.messages[Math.floor(Math.random() * entry.messages.length)];
}

function mapCreds(entry, urlPattern) {
  const message = pickMessage(entry);
  return entry.credentials.map((cred) => ({
    url: urlPattern,
    username: cred.username,
    password: cred.password,
    message,
  }));
}

function getAll() {
  const results = [];
  for (const [pattern, entry] of Object.entries(entries)) {
    results.push(...mapCreds(entry, pattern));
  }
  return results;
}

function matchUrl(queryUrl) {
  const results = [];
  for (const [pattern, entry] of Object.entries(entries)) {
    const regex = new RegExp(pattern.slice(1, -1));
    if (regex.test(queryUrl)) {
      results.push(...mapCreds(entry, pattern));
    }
  }
  return results;
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const openapiPath = path.join(__dirname, "openapi.json");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/" && req.method === "GET") {
    const queryUrl = parsedUrl.query.url;
    const result = queryUrl ? matchUrl(queryUrl) : getAll();
    sendJson(res, 200, result);
  } else if (parsedUrl.pathname === "/openapi.json" && req.method === "GET") {
    fs.readFile(openapiPath, "utf-8", (err, data) => {
      if (err) {
        sendJson(res, 500, { message: "Internal server error" });
      } else {
        sendJson(res, 200, JSON.parse(data));
      }
    });
  } else {
    sendJson(res, 404, { message: "Not found" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`OpenAPI spec at http://localhost:${PORT}/openapi.json`);
});
