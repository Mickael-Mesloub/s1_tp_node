const http = require('http');
const pug = require('pug');
const fs = require('fs');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const u = require('./utils/utils');
require('dayjs/locale/fr');
require('dotenv').config();

const { createServer } = http;
const { compileFile } = pug;
const { readFileSync } = fs;

// env variables from .env file
const { APP_ENV, APP_PORT, APP_LOCALHOST } = process.env;

// functions from utils file
const { defineEnvMessage, handleError } = u;

// declare locale as 'fr' to convert dates into French format
dayjs.extend(localizedFormat);
dayjs.locale('fr');

const server = createServer((req, res) => {
  try {
    const url = req.url;

    // load css file
    if (url && url.includes('styles')) {
      try {
        const css = readFileSync(`${__dirname}/${url}`);

        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(css);
        res.end();
      } catch (err) {
        const message = 'Erreur lors du chargement du fichier de styles';
        handleError({ env: APP_ENV, res, statusCode: 404, message, err });
      }

      return;
    }

    // parse data.json file
    let JSONFile;
    try {
      JSONFile = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));
    } catch (err) {
      const message = 'Erreur lors de la lecture du fichier JSON';
      handleError({ env: APP_ENV, res, statusCode: 500, message, err });
      return;
    }

    // get the array of users from json file
    const { users } = JSONFile;

    if (!users) {
      const message = 'Erreur lors de la récupération des utilisateurs';
      handleError({ env: APP_ENV, res, statusCode: 404, message });

      return;
    }

    // convert users' birthdate into French format
    for (const user of users) {
      user.birth = dayjs(user.birth).format('LL');
    }

    let result;
    try {
      // compile pug home file to send it in response to client
      const compile = compileFile('./views/home.pug', { pretty: true });
      result = compile({ users });
    } catch (err) {
      const message = 'Erreur lors de la compilation du template Pug';
      handleError({ env: APP_ENV, res, statusCode: 500, message, err });

      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result);
  } catch (err) {
    const message = 'Erreur serveur';
    handleError({ env: APP_ENV, res, statusCode: 500, message, err });

    return;
  }
});

server.listen(APP_PORT || 9000, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
  console.log(defineEnvMessage(APP_ENV));
});
