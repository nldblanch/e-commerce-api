import format from "pg-format";
import db from "../../db/connection";

const fetchUserByID = async (id) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = ${id};`);
  const [data] = rows;
  return data
    ? data
    : Promise.reject({ code: 404, message: "user id not found" });
};

const checkUserExists = async (username) => {
  const { rows } = await db.query(
    `SELECT username FROM users where username = '${username}'`
  );
  const [data] = rows;
  if (data) {
    return Promise.reject({
      code: 409,
      message: "conflict - username already taken",
    });
  } else {
    return Promise.resolve();
  }
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

export { fetchUserByID, insertUser };
