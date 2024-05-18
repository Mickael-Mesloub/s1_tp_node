// checks in the array of students if a student with the name we passed in params exists,
// and if so, returns a new array filtered, without this student
const filterStudentsArray = ({ students, name }) => {
  const newArray = students.filter((s) => s.name !== name);
  return newArray;
};

module.exports = { filterStudentsArray };
