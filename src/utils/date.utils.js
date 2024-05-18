const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
require('dayjs/locale/en');
dayjs.extend(localizedFormat);
dayjs.locale('en');

// date formatter
const formatDate = (date) => {
  return dayjs(date).format('LL');
};

module.exports = { formatDate };
