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
  const insertOrderString = format(
    `
              INSERT INTO orders (buyer_id, seller_id, item_id) 
              VALUES %L RETURNING *
              ;`,
    [[buyer_id, seller_id, item_id]]
  );
  const { rows } = await db.query(insertOrderString);
  const [data] = rows;
  return data;
};

export { fetchOrder, fetchUserOrders, insertOrder };
