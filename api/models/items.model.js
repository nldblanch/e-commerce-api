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

const insertItem = async (id, {name, description, price}) => {
    const insertItemString = format(
        `
          INSERT INTO items (user_id, name, description, price) 
          VALUES %L RETURNING *
          ;`,
        [[id, name, description, price]]
      );
      const { rows } = await db.query(insertItemString);
      const [data] = rows;
      return data;
}

export { fetchAllItems, fetchItem, insertItem };
