import format from "pg-format";
import db from "../../db/connection.js";

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

const updateItem = async (user_id, item_id, entries) => {
  const item = await fetchItem(item_id);
  if (item.user_id !== Number(user_id)) {
    return Promise.reject({
      code: 403,
      message: "user id does not match user id associated with item",
    });
  }
  if (entries.length < 1)
    return Promise.reject({
      code: 400,
      message: "bad request - no patch data",
    });

  let queryString = `UPDATE items SET `;
  const values = entries.map(([key, value], i, arr) => {
    queryString += `${key} = $${i + 1}`;
    queryString += i + 1 === arr.length ? " " : ", ";
    return value;
  });

  queryString += `WHERE id = $${values.length + 1} RETURNING * `;
  const { rows } = await db.query(queryString, [...values, item_id]);
  const [data] = rows;
  return data
    ? data
    : Promise.reject({ code: 404, message: "item id not found" });
};

const fetchUserItems = async (id) => {
    const { rows } = await db.query(`SELECT * FROM items WHERE user_id = $1;`, [id]);
    return rows;
}

export { fetchAllItems, fetchItem, insertItem, updateItem, fetchUserItems };
