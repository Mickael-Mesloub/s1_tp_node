const http = require('http');
const pug = require('pug');
const fs = require('fs');
require('dotenv').config();

const { createServer } = http;
const { compileFile } = pug;
const { readFileSync } = fs;

// env variables
const { APP_PORT, APP_LOCALHOST } = process.env;

const server = createServer((req, res) => {
  try {
    // TODO: remove this mock variable when real data is ready
    const data = {
      username: 'Mickaël',
    };

    // parse data.json file
    const fileJSON = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));

    // get the array of users from json file
    const { users } = fileJSON;
    console.log(users);

    // compile pug template file to send it in response to client
    const compile = compileFile('./views/template.pug', { pretty: true });
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
