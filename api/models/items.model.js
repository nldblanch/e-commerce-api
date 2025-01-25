import format from "pg-format";
import db from "../../db/connection.js";
import { greenlist, strictGreenlist } from "../utils/index.js";
import { fetchUserByID } from "./users.model.js";
import { fetchCategoryFromSubcategory } from "./categories.model.js";

const fetchAllItems = async ({ category, subcategory, tag, price_from, price_to, sort_by, order, p = 1 }) => {
  try {
    if (!Number(p)) return Promise.reject({ code: 400, message: "invalid page number given" });
    if (sort_by) {
      await greenlist(["name", "price", "date_listed"], [sort_by]);
    }
    if (order) {
      await greenlist(["asc", "desc"], [order]);
    }

    const queries = [];
    let queryNum = 0;
    let queryString = `
      SELECT items.*, category_name, subcategory_name 
      FROM items 
      LEFT JOIN categories 
      ON items.category_id = categories.id 
      LEFT JOIN subcategories
      ON items.subcategory_id = subcategories.id
      WHERE available_item = TRUE `;
    if (category) {
      queryString += Number(category) ? `AND categories.id = $${++queryNum} ` : `AND category_name = $${++queryNum} `;
      queries.push(category);
    }
    if (subcategory) {
      queryString += Number(subcategory)
        ? `AND subcategories.id = $${++queryNum} `
        : `AND subcategory_name = $${++queryNum} `;
      queries.push(subcategory);
    }
    if (tag) {
      queryString += `AND tag LIKE $${++queryNum} `;
      queries.push("%" + tag + "%");
    }
    if (price_from) {
      queryString += `AND price >= $${++queryNum} `;
      queries.push(price_from);
    }
    if (price_to) {
      queryString += `AND price <= $${++queryNum} `;
      queries.push(price_to);
    }
    if (sort_by) {
      queryString += `ORDER BY ${sort_by} `;
    } else {
      queryString += `ORDER BY name `;
    }
    if (order) {
      queryString += `${order} `;
    } else {
      queryString += "ASC ";
    }
    const offset = (p - 1) * 15;
    queries.push(offset);
    queryString += `LIMIT 15 OFFSET $${++queryNum}`;
    const { rows } = await db.query(queryString, queries);
    if (rows.length > 0) {
      return rows;
    } else {
      const subcategory = await getRelevantSubcategory(tag);
      return Promise.reject({
        code: 404,
        message: "no items found",
        information: subcategory,
      });
    }
  } catch (error) {
    if (error.message === "bad request - invalid key or value") {
      error.message = "invalid query parameter";
    }
    return Promise.reject(error);
  }
};

const getRelevantSubcategory = async (tag = "") => {
  let queryString = `
      SELECT subcategory_name 
      FROM items  
      LEFT JOIN subcategories
      ON items.subcategory_id = subcategories.id
      WHERE available_item = FALSE AND tag LIKE $1`;
  const { rows } = await db.query(queryString, [`%${tag}%`]);
  return rows[0];
};

const fetchItem = async (id) => {
  if (!Number(id)) return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(`SELECT * FROM items WHERE id = $1 ;`, [id]);
  const [data] = rows;
  return data ? data : Promise.reject({ code: 404, message: "item id not found" });
};

const insertItem = async (id, body) => {
  try {
    await strictGreenlist(
      ["name", "description", "price", "tag", "category_id", "subcategory_id", "photo_description", "photo_source"],
      Object.keys(body)
    );

    if (body.photo_source.length < 1) return Promise.reject({ status: 400, message: "invalid data type" });

    await fetchUserByID(id);

    const values = Object.values(body).filter((value) => {
      return !Array.isArray(value);
    });
    const insertItemString = format(
      `
              INSERT INTO items (user_id, name, description, tag, category_id, subcategory_id, price, photo_description) 
              VALUES %L RETURNING *
              ;`,
      [[id, ...values]]
    );
    const { rows: incompleteRows } = await db.query(insertItemString);
    const [incompleteData] = incompleteRows;
    const { id: item_id } = incompleteData;

    const insertPhotoString = format(`UPDATE items SET photo_source = ARRAY[%L] WHERE id = $1 RETURNING *`, [
      body.photo_source,
    ]);
    const { rows } = await db.query(insertPhotoString, [item_id]);
    const [data] = rows;
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateItem = async (user_id, item_id, body) => {
  try {
    await greenlist(
      ["name", "description", "price", "tag", "category_id", "subcategory_id", "photo_description", "photo_source"],
      Object.keys(body)
    );
    await fetchUserByID(user_id);
    const entries = Object.entries(body);
    if (body.subcategory_id) {
      const { category_id } = await fetchCategoryFromSubcategory(body.subcategory_id);
      entries.push(["category_id", category_id]);
    }
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
    return data ? data : Promise.reject({ code: 404, message: "item id not found" });
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchUserItems = async (id) => {
  try {
    await fetchUserByID(id);
    const { rows } = await db.query(`SELECT * FROM items WHERE user_id = $1;`, [id]);
    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchAllItems, fetchItem, insertItem, updateItem, fetchUserItems };
