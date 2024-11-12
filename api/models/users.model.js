import db from "../../db/connection";

const fetchUserByID = async (id) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE id = ${id};`);
  const [data] = rows;
  return data
    ? data
    : Promise.reject({ code: 404, message: "user id not found" });
};

export default fetchUserByID;
