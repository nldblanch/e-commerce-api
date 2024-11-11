exports.convertDateToTimestamp = (time) => {
  return new Date(time).toISOString();
};