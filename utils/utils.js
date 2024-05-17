const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/en');
dayjs.extend(localizedFormat);
dayjs.locale('en');

// adapt the message in console depending on environment
const defineEnvMessage = (env) => {
  let environmentMessage;
  switch (env) {
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
const handleError = ({ env, res, statusCode, message, err }) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  const errorMessage =
    env === 'development' && err ? `${message}: ${err}` : message;
  res.end(errorMessage);
};

// date formatter
const formatDate = (date) => {
  return dayjs(date).format('LL');
};

module.exports = {
  defineEnvMessage,
  handleError,
  formatDate,
};
