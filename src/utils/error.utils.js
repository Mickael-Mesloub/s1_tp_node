require('dotenv').config();

const { APP_ENV } = process.env;

// error handler
const handleError = ({ res, statusCode, message, err }) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  const errorMessage =
    APP_ENV === 'development' && err ? `${message}: ${err}` : message;
  res.end(errorMessage);
};

// error messages to send in response depending on the error
const errorMessages = {
  errorLoadingStylesheet: 'Error loading the stylesheet file',
  errorReadingJSON: 'Error reading the JSON file',
  errorRetrievingStudents: 'Error retrieving students',
  invalidDataFormat: 'Invalid data format.',
  errorProcessingFormData: 'Error processing the form data',
  errorCompilingPugTemplate: 'Error compiling the Pug template',
  internalServerError: 'Internal server error',
};

module.exports = { handleError, errorMessages };
