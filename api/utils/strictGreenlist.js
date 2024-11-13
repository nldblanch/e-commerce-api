const strictGreenlist = (greenlist, array) => {
  return new Promise((resolve, reject) => {
    if (greenlist.length !== array.length)
      reject({ code: 400, message: "bad request - missing key" });
    else {
      array.forEach((element) => {
        if (!greenlist.includes(element))
          reject({ code: 400, message: "bad request - invalid key or value" });
      });
    }
    resolve("successful greenlist");
  });
};

export default strictGreenlist;
