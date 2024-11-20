import pkg from "pg";
const { Pool } = pkg;
import * as dotenv from "dotenv";
import path from "path";
const ENV = process.env.NODE_ENV || "development";
const dirname = path.resolve();
dotenv.config({
  path: `${dirname}/.env.${ENV}`,
});

const config = {
  env: ENV,
};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

export default new Pool(config);
