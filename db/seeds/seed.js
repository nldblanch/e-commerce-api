import format from "pg-format";
import db from "../connection.js";
import { createRef, convertDateToTimestamp } from "./seed-utils.js";

const seed = async ({ users, items, feedback }) => {
  await db.query("DROP SEQUENCE IF EXISTS items_id_seq CASCADE;");
  await db.query("DROP SEQUENCE IF EXISTS users_id_seq CASCADE;");
  await db.query("DROP TABLE IF EXISTS feedback;");

  await db.query("DROP TABLE IF EXISTS items;");
  await db.query("DROP TABLE IF EXISTS users;");

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
                  CREATE TABLE items (
                  id SERIAL PRIMARY KEY
                  ,user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
                  ,name VARCHAR NOT NULL
                  ,description VARCHAR NOT NULL
                  ,price INT NOT NULL
                  ,date_listed TIMESTAMP DEFAULT NOW()
                  ,available_item BOOLEAN DEFAULT TRUE
                  );`);

  await db.query(`
                  CREATE TABLE feedback (
                  seller_id INT NOT NULL,
                  buyer_id INT NOT NULL,
                  rating INT NOT NULL,
                  comment VARCHAR NOT NULL,
                  date_left TIMESTAMP DEFAULT NOW(),
                  FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE,
                  FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE,
                  CONSTRAINT different_users CHECK (seller_id != buyer_id)
                  );`);

  const usersQueryData = users.map(
    ({ username, name, date_registered, balance }) => {
      return [username, name, convertDateToTimestamp(date_registered), balance];
    }
  );

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

  const userData = await db.query(insertIntoUsersQuery);

  const userIdLookup = createRef(userData.rows, "username", "id");

  const itemsQueryData = items.map(
    ({ username, name, description, price, date_listed, available_item }) => {
      const user_id = userIdLookup[username];
      return [
        user_id,
        name,
        description,
        price,
        convertDateToTimestamp(date_listed),
        available_item,
      ];
    }
  );

  const insertIntoItemsQuery = format(
    `INSERT INTO items (
                user_id
                ,name
                ,description
                ,price
                ,date_listed
                ,available_item
                ) 
            VALUES %L
      ;`,
    itemsQueryData
  );

  await db.query(insertIntoItemsQuery);

  const feedbackQueryData = feedback.map(
    ({ seller, buyer, rating, comment, date_left }, i) => {
      const seller_id = userIdLookup[seller];
      const buyer_id = userIdLookup[buyer];
      return [
        seller_id,
        buyer_id,
        rating,
        comment,
        convertDateToTimestamp(date_left),
      ];
    }
  );

  const insertIntoFeedbackQuery = format(
    `INSERT INTO feedback (
                seller_id
                ,buyer_id
                ,rating
                ,comment
                ,date_left
                ) 
            VALUES %L
      ;`,
    feedbackQueryData
  );

  await db.query(insertIntoFeedbackQuery);
};

export default seed;
