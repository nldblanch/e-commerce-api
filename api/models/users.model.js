import format from "pg-format";
import db from "../../db/connection.js";
import strictGreenlist from "../utils/strictGreenlist.js";
import greenlist from "../utils/greenlist.js";

const fetchUserByID = async (id) => {
  if (!Number(id)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM users WHERE id = ${id};`);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "user id not found" });
};

const insertUser = async (body) => {
  await strictGreenlist(["username", "name"], Object.keys(body));
  const [username, name] = Object.values(body);
  const insertUserString = format(
    `
      INSERT INTO users (username, name) 
      VALUES %L RETURNING *
      ;`,
    [[username, name]]
  );
  const { rows } = await db.query(insertUserString);
  const [data] = rows;
  return data;
};

const updateUser = async (id, body) => {
  await greenlist(["username", "name", "avatar_url", "balance"], Object.keys(body));
  const entries = Object.entries(body);

  if (entries.length < 1) return Promise.reject({ code: 400, message: "bad request - no patch data" });

  let queryString = `UPDATE users SET `;
  const values = entries.map(([key, value], i, arr) => {
    queryString += `${key} = $${i + 1}`;
    queryString += i + 1 === arr.length ? " " : ", ";
    return value;
  });

  queryString += `WHERE id = $${values.length + 1} RETURNING * `;
  const { rows } = await db.query(queryString, [...values, id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "user id not found" });
};

export { fetchUserByID, insertUser, updateUser };
