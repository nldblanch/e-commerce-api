const format = require("pg-format");
const db = require("../connection");
const { users, items, feedback } = require("../data/test");
const { convertTimestampToDate, convertDateToTimestamp } = require("./seed-utils");
const seed = async () => {
  await db.query("DROP TABLE IF EXISTS feedback");
  await db.query("DROP TABLE IF EXISTS items");
  await db.query("DROP TABLE IF EXISTS users");
  await db.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY
        ,username VARCHAR NOT NULL
        ,name VARCHAR NOT NULL
        ,avatar_url VARCHAR DEFAULT 'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
        ,date_registered TIMESTAMP DEFAULT NOW()
        ,balance DECIMAL DEFAULT 0
        );`);
  await db.query(`
        CREATE TABLE items (
        id SERIAL PRIMARY KEY
        ,user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
        ,name VARCHAR NOT NULL
        ,description VARCHAR NOT NULL
        ,price DECIMAL NOT NULL
        ,date_listed TIMESTAMP DEFAULT NOW()
        ,available_item BOOLEAN
        );`);
  await db.query(`
        CREATE TABLE feedback (
        seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
        ,buyer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
        ,rating INT NOT NULL
        ,comment VARCHAR NOT NULL
        ,date_left TIMESTAMP DEFAULT NOW()
        );`);
  const insertIntoUsersQuery = format(
    "INSERT INTO users (username, name, date_registered, balance) VALUES %L RETURNING *;",
    users.map(({username, name, date_registered, balance}) => {
      return [username, name, convertDateToTimestamp(date_registered), balance]
    })
  );
  const userData = await db.query(insertIntoUsersQuery);
//   console.log(userData.rows);
};

//   .then(() => {
//     const insertTopicsQueryStr = format(
//       "INSERT INTO topics (slug, description) VALUES %L;",
//       topicData.map(({ slug, description }) => [slug, description])
//     );
//     const topicsPromise = db.query(insertTopicsQueryStr);

//     const insertUsersQueryStr = format(
//       "INSERT INTO users ( username, name, avatar_url) VALUES %L;",
//       userData.map(({ username, name, avatar_url }) => [
//         username,
//         name,
//         avatar_url,
//       ])
//     );
//     const usersPromise = db.query(insertUsersQueryStr);

//     return Promise.all([topicsPromise, usersPromise]);
//   })
//   .then(() => {
//     const formattedArticleData = articleData.map(convertTimestampToDate);
//     const insertArticlesQueryStr = format(
//       "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
//       formattedArticleData.map(
//         ({
//           title,
//           topic,
//           author,
//           body,
//           created_at,
//           votes = 0,
//           article_img_url,
//         }) => [title, topic, author, body, created_at, votes, article_img_url]
//       )
//     );

//     return db.query(insertArticlesQueryStr);
//   })
//   .then(({ rows: articleRows }) => {
//     const articleIdLookup = createRef(articleRows, "title", "article_id");
//     const formattedCommentData = formatComments(commentData, articleIdLookup);

//     const insertCommentsQueryStr = format(
//       "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
//       formattedCommentData.map(
//         ({ body, author, article_id, votes = 0, created_at }) => [
//           body,
//           author,
//           article_id,
//           votes,
//           created_at,
//         ]
//       )
//     );
//     return db.query(insertCommentsQueryStr);
//   });
// };

module.exports = seed;
