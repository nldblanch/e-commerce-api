import format from "pg-format";
import db from "../../db/connection.js";

const fetchOrder = async (id) => {
  if (!Number(id)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM orders WHERE id = $1 ;`, [id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "order id not found" });
};

const fetchUserOrders = async (id) => {
  const { rows } = await db.query(`SELECT * FROM orders WHERE buyer_id = $1;`, [id]);
  return rows;
};

const insertOrder = async (buyer_id, { item_id, seller_id }) => {
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

  return { order, updatedItem };
};

const updateOrder = async (user_id, order_id, patchValue) => {
  const order = await fetchOrder(order_id);
  if (order.buyer_id !== Number(user_id)) {
    return Promise.reject({
      code: 403,
      message: "user id does not match user id associated with order",
    });
  }

  const queryString = "UPDATE orders SET pending_order = $1 WHERE id = $2 RETURNING *";
  const { rows } = await db.query(queryString, [...patchValue, order_id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "order id not found" });
};

export { fetchOrder, fetchUserOrders, insertOrder, updateOrder };
