const compliment = require("./complimentr");
const fs = require("fs");
const http = require("http");
const path = require("path");

function createApp() {
  const routes = [];

  const app = {
    get(url, handler) {
      routes.push({ method: "GET", url, handler });
      return app;
    },
    post(url, handler) {
      routes.push({ method: "POST", url, handler });
      return app;
    },
    listen(port, cb) {
      const server = http.createServer((req, res) => {
        // sugar on res
        res.send = (body, status = 200, type = "text/plain") => {
          res.writeHead(status, { "Content-Type": type });
          res.end(String(body));
        };
        res.sendFile = (filePath) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(fs.readFileSync(filePath));
        };
        res.json = (data, status = 200) => {
          res.writeHead(status, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        };

        const match = routes.find(
          (r) => r.method === req.method && r.url === req.url
        );

        if (match) {
          match.handler(req, res);
        } else {
          res.send("Not Found", 404);
        }
      });

      server.listen(port, cb);
      return server;
    },
  };

  return app;
}

// --- usage ---
const app = createApp();
const port = process.env.PORT || 3000;

app
  .get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")))
  .get("/api", (_, res) => res.send(compliment()))
  .get("/public/randomcompliment/compliment/random", (_, res) => res.send(compliment()))
  .listen(port, () => console.log(`Example app listening on port ${port}`));

module.exports = server;
