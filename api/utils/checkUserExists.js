import db from "../../db/connection"

const checkUserExists = async (username) => {
    const { rows } = await db.query(
      `SELECT username FROM users where username = '${username}'`
    );
    const [data] = rows;
    if (data) {
      return Promise.reject({
        code: 409,
        message: "conflict - username already taken",
      });
    } else {
      return Promise.resolve();
    }
  };

  export default checkUserExists