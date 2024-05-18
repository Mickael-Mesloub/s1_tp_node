const pug = require('pug');

const { handleError, errorMessages } = require('../utils/error.utils');
const { formatDate } = require('../utils/date.utils');

const { compileFile } = pug;

const { errorCompilingPugTemplate } = errorMessages;

const renderStudentsPage = ({ res, students }) => {
  try {
    // students page (/students)
    const compile = compileFile('./src/views/students.pug', {
      pretty: true,
    });
    const result = compile({ students, formatDate });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result);
  } catch (err) {
    return handleError({
      res,
      statusCode: 500,
      message: errorCompilingPugTemplate,
      err,
    });
  }
};

const renderHomePage = ({ res }) => {
  try {
    const compile = compileFile('./src/views/home.pug', { pretty: true });
    const result = compile();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result);
  } catch (err) {
    return handleError({
      res,
      statusCode: 500,
      message: errorCompilingPugTemplate,
      err,
    });
  }
};

const renderNotFoundPage = ({ res }) => {
  try {
    // not found page
    const compile = compileFile('./src/views/not-found.pug', {
      pretty: true,
    });
    const result = compile();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(result);
  } catch (err) {
    return handleError({
      res,
      statusCode: 500,
      message: errorCompilingPugTemplate,
      err,
    });
  }
};

module.exports = {
  renderStudentsPage,
  renderHomePage,
  renderNotFoundPage,
};
