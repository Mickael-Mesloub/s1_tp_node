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

module.exports = { defineEnvMessage };
