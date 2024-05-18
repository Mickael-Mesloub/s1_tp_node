const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/en');
dayjs.extend(localizedFormat);
dayjs.locale('en');
require('dotenv').config();

const { APP_ENV } = process.env;

// adapt the message in console depending on environment
const defineEnvMessage = () => {
  let environmentMessage;
  switch (APP_ENV) {
    case 'development':
      environmentMessage = '🚧 The server is running in DEVELOPMENT mode.';
      break;
    case 'production':
      environmentMessage = '🚀 The server is running in PRODUCTION mode.';
      break;
    default:
      environmentMessage =
        '⚠️  The server is running in an UNKNOWN mode\n- Please check the APP_ENV variable.';
  }
  return environmentMessage;
};

// error handler
const handleError = ({ res, statusCode, message, err }) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  const errorMessage =
    APP_ENV === 'development' && err ? `${message}: ${err}` : message;
  res.end(errorMessage);
};

// date formatter
const formatDate = (date) => {
  return dayjs(date).format('LL');
};

// capitalizes the first letter of a string
const capitalize = (str) => {
  return str.replace(str[0], str[0].toUpperCase());
};

// checks in the array of students if a student with the name we passed in params exists,
// and if so, returns a new array filtered, without this student
const filterStudentsArray = ({ students, name }) => {
  const newArray = students.filter((s) => s.name !== name);
  return newArray;
};

module.exports = {
  defineEnvMessage,
  handleError,
  formatDate,
  capitalize,
  filterStudentsArray,
};
