import data from "../data/test/index.js";
import seed from "./seed.js";
import db from "../connection.js";

const runSeed = () => {
  return seed(data).then(() => db.end());
};

runSeed();
