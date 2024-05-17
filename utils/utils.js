// adapt the message in console depending on environment
exports.defineEnvMessage = (env) => {
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
