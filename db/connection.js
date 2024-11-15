import pkg from "pg"
const {Pool} = pkg;
import * as dotenv from "dotenv"
import path from "path"
const ENV = process.env.NODE_ENV || "development";
const dirname = path.resolve()
dotenv.config({
  path: `${dirname}/.env.${ENV}`
});

const config = {
  env: ENV,
};
// path: `${__dirname}/../.env.${ENV}`,
// console.log(config)
// console.log(process.env)
// console.log(path.resolve())
// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error("PGDATABASE or DATABASE_URL not set");
// }
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}


export default new Pool(config);
