const http = require('http');
const pug = require('pug');
const fs = require('fs');
const u = require('./utils/utils');
require('dotenv').config();

const { createServer } = http;
const { compileFile } = pug;
const { readFileSync } = fs;

// env variables from .env file
const { APP_ENV, APP_PORT, APP_LOCALHOST } = process.env;

// functions from utils file
const { defineEnvMessage, handleError, formatDate } = u;

const server = createServer((req, res) => {
  try {
    const url = req.url;
    const method = req.method;

    // load css file
    if (url && url.includes('styles')) {
      try {
        const css = readFileSync(`${__dirname}/${url}`);

        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(css);
        res.end();
      } catch (err) {
        const message = 'Error loading the stylesheet file';
        handleError({ env: APP_ENV, res, statusCode: 404, message, err });
      }

      return;
    }

    // parse data.json file
    let JSONFile;
    try {
      JSONFile = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));
    } catch (err) {
      const message = 'Error reading the JSON file';
      handleError({ env: APP_ENV, res, statusCode: 500, message, err });
      return;
    }

    // get the array of students from json file
    const { students } = JSONFile;

    if (!students) {
      const message = 'Error retrieving users';
      handleError({ env: APP_ENV, res, statusCode: 404, message });

      return;
    }

    let result;
    try {
      // compile pug home file to send it in response to client
      const compile = compileFile('./views/home.pug', { pretty: true });
      result = compile({ students, formatDate });

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(result);
    } catch (err) {
      const message = 'Error compiling the Pug template';
      handleError({ env: APP_ENV, res, statusCode: 500, message, err });

      return;
    }

    if (url === '/' && method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        let name;
        let birth;
        console.log(body);

        try {
          // regex to check if we receive name={name}&birth={date}
          const regex = /name=([^&]+)&birth=([^&]+)/;

          // check if the response body matches the regex
          const match = body.match(regex);

          // asign values to name and birth if it matches
          if (match) {
            name = match[1];
            birth = match[2];
          }

          if (name && birth) {
            students.push({ name, birth });
          }

          const newData = JSON.stringify({ students });
          fs.writeFileSync('./Data/data.json', newData);
          console.log('JSON file updated successfully!');
          console.log(students);
          res.end();
          return;
        } catch (err) {
          const message = '';
          handleError({ APP_ENV, res, statusCode: 404, message, err });
        }
      });
    }
  } catch (err) {
    const message = 'Internal server error';
    handleError({ env: APP_ENV, res, statusCode: 500, message, err });

    return;
  }
});

server.listen(APP_PORT || 9000, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
  console.log(defineEnvMessage(APP_ENV));
});
