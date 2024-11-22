import format from "pg-format";
import db from "../../db/connection.js";
import { greenlist, strictGreenlist } from "../utils/index.js";
import { fetchUserByID } from "./users.model.js";
import { fetchCategoryFromSubcategory } from "./categories.model.js";

const fetchAllItems = async ({ category, subcategory, tag, price_from, price_to, sort_by, order }) => {
  try {
    if (sort_by) {
      await greenlist(["name", "price", "date_listed"], [sort_by]);
    }
    if (order) {
      await greenlist(["asc", "desc"], [order]);
    }

    const queries = [];
    let queryNum = 0;
    let queryString = `
      SELECT items.*, categories.id AS category_id, subcategories.id AS subcategory_id 
      FROM items 
      LEFT JOIN categories 
      ON items.category_id = categories.id 
      LEFT JOIN subcategories
      ON subcategories.category_id = categories.id
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
    const { rows } = await db.query(queryString, queries);
    return rows.length > 0 ? rows : Promise.reject({ code: 404, message: "no items found" });
  } catch (error) {
    if (error.message === "bad request - invalid key or value") {
      error.message = "invalid query parameter";
    }
    return Promise.reject(error);
  }
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
      [
        "name",
        "description",
        "price",
        "tag",
        "category_id",
        "subcategory_id",
        "photo_description",
        "photo_source",
        "photo_link",
      ],
      Object.keys(body)
    );
    await fetchUserByID(id);
    const values = Object.values(body);
    const insertItemString = format(
      `
              INSERT INTO items (user_id, name, description, tag, category_id, subcategory_id, price, photo_description, photo_source, photo_link) 
              VALUES %L RETURNING *
              ;`,
      [[id, ...values]]
    );
    const { rows } = await db.query(insertItemString);
    const [data] = rows;
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateItem = async (user_id, item_id, body) => {
  try {
    await greenlist(
      [
        "name",
        "description",
        "price",
        "tag",
        "category_id",
        "subcategory_id",
        "photo_description",
        "photo_source",
        "photo_link",
      ],
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
