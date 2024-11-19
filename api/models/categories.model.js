import db from "../../db/connection.js";
const fetchAllCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories;`);

  return rows;
};
const fetchSubcategories = async (category_id) => {
  if (!Number(category_id))
    return Promise.reject({ code: 400, message: "bad request - invalid id" });
  const { rows } = await db.query(
    `SELECT * FROM subcategories WHERE category_id = $1;`,
    [category_id]
  );

  return rows.length === 0
    ? Promise.reject({ code: 404, message: "category id not found" })
    : rows;
};

export { fetchSubcategories, fetchAllCategories };
