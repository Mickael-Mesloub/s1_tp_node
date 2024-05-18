const pug = require('pug');
const { handleError, errorMessages } = require('../utils/error.utils');
const { formatDate } = require('../utils/date.utils');
const { compileFile } = pug;
const { errorCompilingPugTemplate } = errorMessages;

// renders a page depending on the value of the "page" param
const renderPage = ({ page, res, students }) => {
  try {
    const filePath = `./src/views/${page}.pug`;
    const compile = compileFile(filePath, { pretty: true });
    const isStudentsPage = page === 'students';

    // we need to pass students and formatDate only for students page
    const result = isStudentsPage
      ? compile({ students, formatDate })
      : compile();
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
  renderPage,
};
