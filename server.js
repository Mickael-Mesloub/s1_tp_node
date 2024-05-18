const http = require('http');
const pug = require('pug');
const fs = require('fs');
const server_utils = require('./utils/server.utils');
const student_utils = require('./utils/student.utils');
const string_utils = require('./utils/string.utils');
const date_utils = require('./utils/date.utils');
require('dotenv').config();

const { createServer } = http;
const { compileFile } = pug;
const { readFileSync, writeFileSync } = fs;

// env variables from .env file
const { APP_PORT, APP_LOCALHOST } = process.env;

// functions from utils files
const { defineEnvMessage, handleError } = server_utils;
const { filterStudentsArray } = student_utils;
const { capitalize } = string_utils;
const { formatDate } = date_utils;

const server = createServer((req, res) => {
  try {
    const { url, method } = req;

    // load CSS file
    if (url && url.includes('styles')) {
      try {
        const css = readFileSync(`${__dirname}/${url}`);
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.write(css);
        res.end();
      } catch (err) {
        const message = 'Error loading the stylesheet file';
        handleError({ res, statusCode: 404, message, err });
      }
      return;
    }

    // parse data.json file
    let JSONFile;
    try {
      JSONFile = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));
    } catch (err) {
      const message = 'Error reading the JSON file';
      handleError({ res, statusCode: 500, message, err });
      return;
    }

    // retrieve the array of students from JSON file
    const { students } = JSONFile;

    if (!students) {
      const message = 'Error retrieving students';
      handleError({ res, statusCode: 404, message });
      return;
    }

    if (url === '/' && method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          let name;
          let birth;

          // regex to check if we receive name={name}&birth={date}
          const regex = /name=([^&]+)&birth=([^&]+)/;

          // check if the response body matches the regex
          const match = body.match(regex);

          // assign values to name and birth if it matches
          if (match) {
            name = capitalize(match[1]);
            birth = match[2];
          }

          // if we receive undefined or empty strings, display an error message
          if (!name || name === '' || !birth || birth === '') {
            const message = 'Invalid data format.';
            handleError({ res, statusCode: 400, message });
          } else {
            // if everything is ok, add new student in students array
            students.push({ name, birth });

            const newData = JSON.stringify({ students });
            // rewrite JSON file with the new array (with the student freshly created)
            writeFileSync('./Data/data.json', newData);
            console.log(
              `New student "${name}" added and JSON file updated successfully!`
            );

            // redirect to /students after handling the request
            res.writeHead(301, { Location: '/students' });
            res.end();
          }
        } catch (err) {
          const message = 'Error processing the form data';
          handleError({ res, statusCode: 500, message, err });
        }
      });
      return;
    }

    if (url === '/' && method === 'GET') {
      try {
        // compile pug home file to send it in response to client
        const compile = compileFile('./views/home.pug', { pretty: true });
        const result = compile();

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(result);
      } catch (err) {
        const message = 'Error compiling the Pug template';
        handleError({ res, statusCode: 500, message, err });
      }
    } else if (url === '/students' && method === 'GET') {
      try {
        // students page (/students)
        const compile = compileFile('./views/students.pug', { pretty: true });
        const result = compile({ students, formatDate });

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(result);
      } catch (err) {
        const message = 'Error compiling the Pug template';
        handleError({ res, statusCode: 500, message, err });
      }
    } else if (url.includes('delete') && method === 'GET') {
      // retrieve name from url (url is /students/delete/{name})
      const name = url.split('/').pop();

      // new array without the student we want to delete
      const newStudents = filterStudentsArray({ students, name });

      const newData = JSON.stringify({ students: newStudents });

      // rewrite the JSON file with the new array (without the student we want to delete)
      writeFileSync('./Data/data.json', newData);
      console.log(
        `Student "${name}" deleted and JSON file updated successfully!`
      );

      // redirect to /students after deleting student to update the student list
      res.writeHead(301, { Location: '/students' });
      res.end();
    } else {
      try {
        // not found page
        const compile = compileFile('./views/not-found.pug', { pretty: true });
        const result = compile();

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(result);
      } catch (err) {
        const message = 'Error compiling the Pug template';
        handleError({ res, statusCode: 500, message, err });
      }
    }
  } catch (err) {
    const message = 'Internal server error';
    handleError({ res, statusCode: 500, message, err });
  }
});

server.listen(APP_PORT || 9000, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
  console.log(defineEnvMessage());
});
