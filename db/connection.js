import {Pool} from "pg"
import * as dotenv from "dotenv"
const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};


export default new Pool(config);
