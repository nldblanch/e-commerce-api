import endpoints from "../../endpoints.js";

const fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(endpoints);
    }, 300);
  });
};

export default fetchEndpoints;
