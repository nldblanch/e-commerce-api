exports.convertDateToTimestamp = (time) => {
  return new Date(time).toISOString();
};

exports.createRef = (array, key, value) => {
    return array.reduce((ref, element) => {
      ref[element[key]] = element[value];
      return ref;
    }, {});
  };
  