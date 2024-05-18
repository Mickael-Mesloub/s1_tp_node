// capitalizes the first letter of a string
const capitalize = (str) => {
  return str.replace(str[0], str[0].toUpperCase());
};

module.exports = { capitalize };
