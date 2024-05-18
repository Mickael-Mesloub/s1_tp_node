// *********** IMPORTS *********** \\

const http = require('http');
const { createServer } = http;
require('dotenv').config();

// imports from utils files
const { defineEnvMessage } = require('./src/utils/server.utils');
const { handleError, errorMessages } = require('./src/utils/error.utils');

// imports from helpers files
const { loadCSS, JSONFile } = require('./src/helpers/fileHelpers');

// *********** CONSTANTS *********** \\

// env variables from .env file
const { APP_PORT, APP_LOCALHOST } = process.env;

// destructure errorMessages
const { errorRetrievingStudents, internalServerError } = errorMessages;

// destructure pageHelpers
const { renderPage } = require('./src/helpers/pageHelpers');

// destructure studentHelpers
const { addStudent, deleteStudent } = require('./src/helpers/studentHelpers');

// *********** SERVER *********** \\

const server = createServer((req, res) => {
  try {
    const { url, method } = req;
    // retrieve the array of students from JSON file
    const { students } = JSONFile();

    // send error if cannot retrieve students
    if (!students) {
      return handleError({
        res,
        statusCode: 404,
        message: errorRetrievingStudents,
      });
    }

    // load CSS file
    if (url.includes('styles')) {
      loadCSS({ res, url });
      return;
    }

    // render home page
    else if (url === '/' && method === 'GET') {
      renderPage({ page: 'home', res });
      return;
    }

    // add a new student from home page thanks to the form
    else if (url === '/' && method === 'POST') {
      addStudent({ req, res, students });
      return;
    }

    // render students page
    else if (url === '/students' && method === 'GET') {
      renderPage({ page: 'students', res, students });
      return;
    }

    // delete a student
    else if (url.includes('delete') && method === 'GET') {
      deleteStudent({ res, url, students });
      return;
    }

    // render not-found page if wee try to reach a route different from the ones above
    else {
      renderPage({ page: 'not-found', res });
      return;
    }

    // send error if a not handled error occurs
  } catch (err) {
    return handleError({
      res,
      statusCode: 500,
      message: internalServerError,
      err,
    });
  }
});

server.listen(APP_PORT || 9000, APP_LOCALHOST, () => {
  console.log(`Server is running at http://${APP_LOCALHOST}:${APP_PORT}`);
  console.log(defineEnvMessage());
});
