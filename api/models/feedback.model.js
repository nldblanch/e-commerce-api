import format from "pg-format";
import db from "../../db/connection.js";
import { strictGreenlist } from "../utils/index.js";
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

const insertFeedback = async (id, body) => {
  try {
    await strictGreenlist(["seller_id", "buyer_id", "rating", "comment"], Object.keys(body));
    const order = await fetchOrder(id);
    if (order.pending_order) {
      return Promise.reject({ code: 422, message: "unprocessable - order is pending" });
    }
    if (!order.pending_feedback) {
      return Promise.reject({ code: 409, message: "conflict - feedback has already been given" });
    }
    const values = Object.values(body);
    const insertFeedbackString = format(
      `
                    INSERT INTO feedback (order_id, seller_id, buyer_id, rating, comment) 
                    VALUES %L RETURNING *
                    ;`,
      [[id, ...values]]
    );
    const {
      rows: [data],
    } = await db.query(insertFeedbackString);
    await db.query(`UPDATE orders SET pending_feedback = FALSE WHERE id = $1`, [id]);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchUserFeedback, fetchFeedbackByOrderID, insertFeedback };
