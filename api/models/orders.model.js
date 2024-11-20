import db from "../../db/connection.js";

const fetchOrder = async (id) => {
  if (!Number(id)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM orders WHERE id = $1 ;`, [id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "order id not found" });
};

export { fetchOrder };
