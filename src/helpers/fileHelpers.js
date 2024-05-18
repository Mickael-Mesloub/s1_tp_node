const fs = require('fs');
const path = require('path');
const { handleError, errorMessages } = require('../utils/error.utils');

const { readFileSync } = fs;

const { errorLoadingStylesheet, errorReadingJSON } = errorMessages;

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

const JSONFile = () => {
  // parse data.json file
  let JSONFile;
  try {
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
