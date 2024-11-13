const greenlist = (greenlist, array) => {
  return new Promise((resolve, reject) => {
    array.forEach((element) => {
      if (!greenlist.includes(element))
        reject({ code: 400, message: "bad request - invalid key or value" });
    });
    resolve("successful greenlist");
  });
};

export default greenlist;