const { readFileSync } = require('fs');
const path = require('path');
const { handleError, errorMessages } = require('../utils/error.utils');

// destructure errorMessages from error utils
const { errorLoadingStylesheet, errorReadingJSON } = errorMessages;

// loads the CSS file
const loadCSS = ({ res, url }) => {
  const cssPath = path.join(__dirname, '..', url);

  try {
    const css = readFileSync(cssPath);
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.write(css);
    res.end();
  } catch (err) {
    return handleError({
      res,
      statusCode: 404,
      message: errorLoadingStylesheet,
      err,
    });
  }
};

// returns the JSON file containing the students data
const JSONFile = () => {
  let JSONFile;
  try {
    // parse data.json file
    JSONFile = JSON.parse(readFileSync('./Data/data.json', 'utf-8'));
  } catch (err) {
    return handleError({
      res,
      statusCode: 500,
      message: errorReadingJSON,
      err,
    });
  }
  return JSONFile;
};

module.exports = {
  loadCSS,
  JSONFile,
};
