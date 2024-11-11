const endpoints = require("../../endpoints.json");

exports.fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(endpoints);
    }, 300);
  });
};
