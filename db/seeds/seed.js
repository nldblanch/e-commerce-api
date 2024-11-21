import format from "pg-format";
import db from "../connection.js";
import { createRef, convertDateToTimestamp } from "./seed-utils.js";

const seed = async ({ users, items, feedback, categories, orders }) => {
  await dropTables();
  await createTables();

  const userData = await insertUsers(users);

  const userIdLookup = createRef(userData.rows, "username", "id");

  const categoryData = await insertCategories(categories);

  const categoryIdLookup = createRef(categoryData.rows, "category_name", "id");

  const subcategoriesData = await insertSubcategories(categories, categoryIdLookup);

  const subcategoryIdLookup = createRef(subcategoriesData.rows, "subcategory_name", "id");

  await insertItems(items, userIdLookup, categoryIdLookup, subcategoryIdLookup);

  await insertOrders(orders);

  await insertFeedback(feedback, userIdLookup);
};

const dropTables = async () => {
  await db.query("DROP TABLE IF EXISTS feedback;");
  await db.query("DROP TABLE IF EXISTS orders");
  await db.query("DROP TABLE IF EXISTS items;");
  await db.query("DROP TABLE IF EXISTS subcategories");
  await db.query("DROP TABLE IF EXISTS categories");
  await db.query("DROP TABLE IF EXISTS users;");
};

const createTables = async () => {
  await db.query(`
    CREATE TABLE users (
    id SERIAL PRIMARY KEY
    ,username VARCHAR NOT NULL UNIQUE
    ,name VARCHAR NOT NULL
    ,avatar_url VARCHAR DEFAULT 'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
    ,date_registered TIMESTAMP DEFAULT NOW()
    ,balance INTEGER DEFAULT 0
    );`);
  await db.query(`
      CREATE TABLE categories (
      id SERIAL PRIMARY KEY
      ,category_name VARCHAR NOT NULL
      );`);
  await db.query(`
      CREATE TABLE subcategories (
      id SERIAL PRIMARY KEY
      ,category_id INT NOT NULL
      ,subcategory_name VARCHAR NOT NULL
      ,FOREIGN KEY(category_id) REFERENCES categories(id)
      );`);
  await db.query(`
      CREATE TABLE items (
      id SERIAL PRIMARY KEY
      ,user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      ,name VARCHAR NOT NULL
      ,description VARCHAR NOT NULL
      ,tag VARCHAR NOT NULL
      ,category_id INT NOT NULL
      ,subcategory_id INT NOT NULL
      ,price INT NOT NULL
      ,date_listed TIMESTAMP DEFAULT NOW()
      ,photo_description VARCHAR
      ,photo_source VARCHAR
      ,photo_link VARCHAR
      ,available_item BOOLEAN DEFAULT TRUE
      ,FOREIGN KEY(category_id) REFERENCES categories(id)
      ,FOREIGN KEY(subcategory_id) REFERENCES subcategories(id)
      );`);
  await db.query(`
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY
      ,buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      ,seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      ,item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE
      ,pending_order BOOLEAN DEFAULT TRUE
      ,pending_feedback BOOLEAN DEFAULT TRUE
      ,date_ordered TIMESTAMP DEFAULT NOW()
      ,FOREIGN KEY(buyer_id) REFERENCES users(id)
      ,FOREIGN KEY(seller_id) REFERENCES users(id)
      ,FOREIGN KEY(item_id) REFERENCES items(id)
      )
    `);
  await db.query(`
      CREATE TABLE feedback (
      id SERIAL PRIMARY KEY
      ,order_id INT NOT NULL
      ,seller_id INT NOT NULL
      ,buyer_id INT NOT NULL
      ,rating INT NOT NULL
      ,comment VARCHAR NOT NULL
      ,date_left TIMESTAMP DEFAULT NOW()
      ,FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
      ,FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
      ,FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE
      ,CONSTRAINT different_users CHECK (seller_id != buyer_id)
      );`);
};

const insertUsers = async (users) => {
  const usersQueryData = users.map(({ username, name, date_registered, balance }) => {
    return [username, name, convertDateToTimestamp(date_registered), balance];
  });
  const insertIntoUsersQuery = format(
    `INSERT INTO users (
                  username
                  ,name
                  ,date_registered
                  ,balance
                  ) 
            VALUES %L 
            RETURNING *
      ;`,
    usersQueryData
  );

  return db.query(insertIntoUsersQuery);
};

const insertCategories = async (categories) => {
  const categoriesQueryData = categories.map((category) => {
    return [category.name];
  });
  const insertIntoCategoriesQuery = format(
    `INSERT INTO categories (
                  category_name
                  )  
            VALUES %L
            RETURNING * 
  ;`,
    categoriesQueryData
  );

  return db.query(insertIntoCategoriesQuery);
};

const insertSubcategories = async (categories, categoryIdLookup) => {
  const subcategoriesQueryData = categories
    .map(({ name, subcategories }) => {
      const category_id = categoryIdLookup[name];
      return subcategories.map((subcategory) => {
        return [category_id, subcategory];
      });
    })
    .flat();
  const insertIntoSubcategoriesQuery = format(
    `INSERT INTO subcategories (
                              category_id,
                              subcategory_name
                              )
                        VALUES %L
                        RETURNING *  
    ;`,
    subcategoriesQueryData
  );

  return db.query(insertIntoSubcategoriesQuery);
};

const insertItems = async (items, userIdLookup, categoryIdLookup, subcategoryIdLookup) => {
  const itemsQueryData = items.map(
    ({
      username,
      name,
      description,
      category,
      subcategory,
      tag,
      price,
      date_listed,
      photo: { description: photo_description, url, link },
      available_item,
    }) => {
      const user_id = userIdLookup[username];
      const category_id = categoryIdLookup[category];
      const subcategory_id = subcategoryIdLookup[subcategory];
      return [
        user_id,
        name,
        description,
        tag,
        category_id,
        subcategory_id,
        price,
        convertDateToTimestamp(date_listed),
        photo_description,
        url,
        link,
        available_item,
      ];
    }
  );

  const insertIntoItemsQuery = format(
    `INSERT INTO items (
                user_id
                ,name
                ,description
                ,tag
                ,category_id
                ,subcategory_id
                ,price
                ,date_listed
                ,photo_description
                ,photo_source
                ,photo_link
                ,available_item
                ) 
            VALUES %L
      ;`,
    itemsQueryData
  );

  return db.query(insertIntoItemsQuery);
};

const insertOrders = async (orders) => {
  const ordersQueryData = orders.map(({ buyer_id, seller_id, item_id }) => {
    return [buyer_id, seller_id, item_id];
  });
  const insertIntoOrdersQuery = format(
    `INSERT INTO orders (
                  buyer_id
                  ,seller_id
                  ,item_id
                  )  
            VALUES %L
            RETURNING * 
  ;`,
    ordersQueryData
  );

  return db.query(insertIntoOrdersQuery);
};

const insertFeedback = async (feedback, userIdLookup) => {
  const feedbackQueryData = feedback.map(({ seller, buyer, order_id, rating, comment, date_left }, i) => {
    const seller_id = userIdLookup[seller];
    const buyer_id = userIdLookup[buyer];
    return [seller_id, buyer_id, order_id, rating, comment, convertDateToTimestamp(date_left)];
  });

  const insertIntoFeedbackQuery = format(
    `INSERT INTO feedback (
                seller_id
                ,buyer_id
                ,order_id
                ,rating
                ,comment
                ,date_left
                ) 
            VALUES %L
      ;`,
    feedbackQueryData
  );

  return db.query(insertIntoFeedbackQuery);
};

export default seed;
