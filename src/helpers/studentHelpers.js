const fs = require('fs');
const { handleError, errorMessages } = require('../utils/error.utils');
const { capitalize } = require('../utils/string.utils');
const { filterStudentsArray } = require('../utils/student.utils');
const { writeFileSync } = fs;
const { invalidDataFormat, errorProcessingFormData } = errorMessages;

// creates a new student and adds it in the array of students of the data.json file
const addStudent = ({ req, res, students }) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      let name;
      let birth;

      // regex to check if we receive name={name}&birth={date}
      const regex = /name=([^&]+)&birth=([^&]+)/;

      // check if the response body matches the regex
      const match = body.match(regex);

      // assign values to name and birth if it matches
      if (match) {
        name = capitalize(match[1]);
        birth = match[2];
      }

      // if we receive undefined or empty strings, display an error message
      if (!name || name === '' || !birth || birth === '') {
        return handleError({
          res,
          statusCode: 400,
          message: invalidDataFormat,
        });
      } else {
        // if everything is ok, add new student in students array
        students.push({ name, birth });

        const newData = JSON.stringify({ students });
        // rewrite JSON file with the new array (with the student freshly created)
        writeFileSync('./Data/data.json', newData);
        console.log(
          `New student "${name}" added and JSON file updated successfully!`
        );

        // redirect to /students once the request is handled
        res.writeHead(301, { Location: '/students' });
        res.end();
      }
    } catch (err) {
      return handleError({
        res,
        statusCode: 500,
        message: errorProcessingFormData,
        err,
      });
    }
  });
};

// deletes a student from the students array in the data.json file
const deleteStudent = ({ res, url, students }) => {
  // retrieve name from url (url is /students/delete/{name})
  const name = url.split('/').pop();

  // new array without the student we want to delete
  const newStudents = filterStudentsArray({ students, name });

  const newData = JSON.stringify({ students: newStudents });

  // rewrite the JSON file with the new array (without the student we want to delete)
  writeFileSync('./Data/data.json', newData);
  console.log(`Student "${name}" deleted and JSON file updated successfully!`);

  // redirect to /students after deleting student to update the student list
  res.writeHead(301, { Location: '/students' });
  res.end();
};

module.exports = {
  addStudent,
  deleteStudent,
};
