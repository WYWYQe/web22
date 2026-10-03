// server.js  (client-side website)
// A tiny static file server with no external dependencies, so the
// pages can be opened over http:// instead of file:// (which some
// browsers block from calling the API with fetch).
//
// Run:   node server.js
// Then:  http://localhost:5500
//
// The REST API must also be running (in the usernameA2-api folder):
//        node server.js          -> http://localhost:3000

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 5500;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif' : 'image/gif',
  '.svg' : 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico' : 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer(function (req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const relative = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.resolve(ROOT, '.' + relative);

  // never serve anything outside this project folder
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  fs.readFile(filePath, function (err, content) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(
        '<h1>404 &ndash; File not found</h1>' +
        '<p>' + relative + '</p>' +
        '<p><a href="/">Back to the home page</a></p>'
      );
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, function () {
  console.log('Client website running at http://localhost:' + PORT);
  console.log('Remember to start the API too:  cd ../usernameA2-api  &&  node server.js');
});
