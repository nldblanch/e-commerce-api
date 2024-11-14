import format from "pg-format";
import db from "../../db/connection";

const fetchAllItems = async () => {
  const { rows } = await db.query(
    `SELECT * FROM items WHERE available_item = TRUE ;`
  );

  return rows;
};

const fetchItem = async (id) => {
  if (!Number(id))
    return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM items WHERE id = $1 ;`, [id]);
  const [data] = rows;
  return data
    ? data
    : Promise.reject({ code: 404, message: "item id not found" });
};

export { fetchAllItems, fetchItem };
