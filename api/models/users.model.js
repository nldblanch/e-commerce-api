import format from "pg-format";
import db from "../../db/connection";
import checkUserExists from "../utils/checkUserExists";

const fetchUserByID = async (id) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = ${id};`);
  const [data] = rows;
  return data
    ? data
    : Promise.reject({ code: 404, message: "user id not found" });
};

const insertUser = async ({ username, name }) => {
  await checkUserExists(username);

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

const updateUser = async (id, entries) => {
  if (entries.length < 1) return Promise.reject({code: 400, message: "bad request - no patch data"})

  let queryString = `UPDATE users SET `;
  const values = entries.map(([key, value], i, arr) => {
    queryString += `${key} = $${i + 1}`;
    queryString += i + 1 === arr.length ? " " : ", "
    return value;
  });

  queryString += `WHERE id = $${values.length + 1} RETURNING * `;
  const { rows } = await db.query(queryString, [...values, id]);
  const [data] = rows;
  return data ? data : Promise.reject({code: 404, message: "user id not found"});
};

export { fetchUserByID, insertUser, updateUser };
