const http = require('http');
const pug = require('pug');
require('dotenv').config();
const { APP_PORT, APP_LOCALHOST } = process.env;

const server = http.createServer((req, res) => {
  try {
    const data = {
      username: 'Mickaël',
    };
    const compile = pug.compileFile('./views/template.pug', { pretty: true });
    const result = compile(data);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Erreur lors de la lecture du fichier');
  }
});

server.listen(APP_PORT || 9000, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
});
