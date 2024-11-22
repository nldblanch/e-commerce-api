import db from "../../db/connection.js";
import { fetchOrder } from "./orders.model.js";
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

const fetchFeedbackByOrderID = async (id) => {
  try {
    await fetchOrder(id);
    const { rows } = await db.query(`SELECT * FROM feedback WHERE order_id = $1;`, [id]);
    const [data] = rows;
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchUserFeedback, fetchFeedbackByOrderID };
