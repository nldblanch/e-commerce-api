import format from "pg-format";
import db from "../../db/connection.js";
import { strictGreenlist } from "../utils/index.js";
import { fetchOrder } from "./orders.model.js";
import { fetchUserByID } from "./users.model.js";

const fetchUserFeedback = async (id, { months }) => {
  try {
    const queries = [id];

    await fetchUserByID(id);
    let queryString = `SELECT * FROM feedback WHERE seller_id = $1 `;
    if (months) {
      if (!Number(months)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
      const now = new Date();
      const dateMonthsAgo = new Date(now);
      dateMonthsAgo.setMonth(now.getMonth() - months);
      queryString += "AND date_left >= $2 ";
      queryString += "AND date_left <= $3 ";
      queries.push(dateMonthsAgo, now);
    }
    const { rows } = await db.query(queryString, queries);
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
    if (body.seller_id === body.buyer_id) {
      return Promise.reject({ code: 409, message: "conflict - buyer id cannot match seller id" });
    }
    if (order.seller_id !== body.seller_id) {
      return Promise.reject({ code: 400, message: "bad request - seller id does not match on order" });
    }
    if (order.buyer_id !== body.buyer_id) {
      return Promise.reject({ code: 400, message: "bad request - buyer id does not match on order" });
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
