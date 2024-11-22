import db from "../../db/connection.js";
import { fetchUserByID } from "./users.model.js";

const fetchUserFeedback = async (id) => {
  try {
    await fetchUserByID(id);
    const { rows } = await db.query(`SELECT * FROM feedback WHERE seller_id = $1;`, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchUserFeedback };
