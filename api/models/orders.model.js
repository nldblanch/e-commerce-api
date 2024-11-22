import format from "pg-format";
import db from "../../db/connection.js";
import { fetchUserByID } from "./users.model.js";
import { greenlist, strictGreenlist } from "../utils/index.js";
import { fetchItem } from "./items.model.js";

const fetchOrder = async (id) => {
  if (!Number(id)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM orders WHERE id = $1 ;`, [id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "order id not found" });
};

const fetchUserOrders = async (id) => {
  try {
    await fetchUserByID(id);
    const { rows } = await db.query(`SELECT * FROM orders WHERE buyer_id = $1;`, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

const insertOrder = async (buyer_id, body) => {
  try {
    await strictGreenlist(["item_id", "seller_id"], Object.keys(body));
    await fetchUserByID(buyer_id);
    const { seller_id, item_id } = body;
    const item = await fetchItem(item_id);
    if (item.user_id !== seller_id) {
      return Promise.reject({ code: 409, message: "conflict - seller id does not match item seller id" });
    }
    if (!item.available_item) {
      return Promise.reject({ code: 404, message: "item not available" });
    }
    await db.query(`BEGIN;`);

    await db.query(`SELECT * FROM items WHERE id = $1 FOR UPDATE;`, [item_id]);

    const insertOrderString = format(
      `
                  INSERT INTO orders (buyer_id, seller_id, item_id) 
                  VALUES %L RETURNING *
                  ;`,
      [[buyer_id, seller_id, item_id]]
    );
    const {
      rows: [order],
    } = await db.query(insertOrderString);

    const {
      rows: [updatedItem],
    } = await db.query(
      `
          UPDATE items SET available_item = FALSE 
          WHERE id = $1 AND available_item = TRUE RETURNING *;`,
      [item_id]
    );

    await db.query(`COMMIT;`);

    return { order, item: updatedItem };
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateOrder = async (user_id, order_id, body) => {
  try {
    await strictGreenlist(["pending_order"], Object.keys(body));
    await greenlist([true, false], Object.values(body));
    await fetchUserByID(user_id);
    const order = await fetchOrder(order_id);
    if (order.buyer_id !== Number(user_id)) {
      return Promise.reject({
        code: 403,
        message: "user id does not match user id associated with order",
      });
    }

    const queryString = "UPDATE orders SET pending_order = $1 WHERE id = $2 RETURNING *";
    const { rows } = await db.query(queryString, [...Object.values(body), order_id]);
    const [data] = rows;
    return data ? data : Promise.reject({ code: 404, message: "order id not found" });
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchOrder, fetchUserOrders, insertOrder, updateOrder };
