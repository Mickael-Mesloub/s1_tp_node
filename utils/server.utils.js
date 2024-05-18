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

module.exports = {
  defineEnvMessage,
  handleError,
};
