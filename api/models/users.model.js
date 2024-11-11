const db = require("../../db/connection");

exports.fetchUserByID = async (id) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = ${id};`);
  const [data] = rows;
  return data ? data : Promise.reject({code: 404, message: "user id not found"});
};
