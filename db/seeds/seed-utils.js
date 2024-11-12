const convertDateToTimestamp = (time) => {
  return new Date(time).toISOString();
};

const createRef = (array, key, value) => {
  return array.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

export { convertDateToTimestamp, createRef };
