
import { users, items, feedback } from "../data/test/index.js";
import seed from "./seed.js";
import db from "../connection.js"

const runSeed = () => {
  return seed({users, items, feedback}).then(() => db.end());
};

runSeed();