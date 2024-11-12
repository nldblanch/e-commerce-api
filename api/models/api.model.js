import endpoints from "../../endpoints.json";

const fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(endpoints);
    }, 300);
  });
};

export default fetchEndpoints;
