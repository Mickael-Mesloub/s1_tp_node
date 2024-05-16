const http = require('http');
const pug = require('pug');
const fs = require('fs');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/fr');
require('dotenv').config();

const { createServer } = http;
const { compileFile } = pug;
const { readFileSync } = fs;

// env variables
const { APP_PORT, APP_LOCALHOST } = process.env;

// declare locale as 'fr' to convert dates into French format
dayjs.extend(localizedFormat);
dayjs.locale('fr');

const server = createServer((_, res) => {
  try {
    // parse data.json file
    const fileJSON = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));

    // get the array of users from json file
    const { users } = fileJSON;

    // convert users' birthdate into French format
    for (const user of users) {
      user.birth = dayjs(user.birth).format('LL');
    }

    // compile pug template file to send it in response to client
    const compile = compileFile('./views/template.pug', { pretty: true });
    const result = compile({ users });

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
