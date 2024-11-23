import data from "../db/data/test";
import db from "../db/connection.js";
import seed from "../db/seeds/seed.js";

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed", () => {
  describe("users table", () => {
    test("users table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'users'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                          FROM information_schema.columns
                          WHERE table_name = 'users'
                          AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('users_id_seq'::regclass)");
      });

      test("username", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'users'
                            AND column_name = 'username';`
        );
        expect(column.column_name).toBe("username");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("name", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'users'
                          AND column_name = 'name';`
        );
        expect(column.column_name).toBe("name");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("avatar_url", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                            FROM information_schema.columns
                            WHERE table_name = 'users'
                            AND column_name = 'avatar_url';`
        );
        expect(column.column_name).toBe("avatar_url");
        expect(column.data_type).toBe("character varying");

        expect(column.column_default).toBe(
          "'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'::character varying"
        );
      });

      test("date_registered", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                            FROM information_schema.columns
                            WHERE table_name = 'users'
                            AND column_name = 'date_registered';`
        );
        expect(column.column_name).toBe("date_registered");
        expect(column.data_type).toBe("timestamp without time zone");
        expect(column.column_default).toBe("now()");
      });

      test("balance", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                              FROM information_schema.columns
                              WHERE table_name = 'users'
                              AND column_name = 'balance';`
        );
        expect(column.column_name).toBe("balance");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("0");
      });
    });

    describe("properties", () => {
      test("username column is unique", async () => {
        const {
          rows: [idUnique],
        } = await db.query(`
                SELECT
                  conname
                FROM pg_constraint
                JOIN pg_attribute
                  ON pg_constraint.conkey[1] = pg_attribute.attnum
                WHERE conrelid = 'users'::regclass
                AND pg_attribute.attname = 'username'
                AND contype = 'u';
              `);
        expect(idUnique).not.toBeUndefined();
      });
    });
  });

  describe("categories table", () => {
    test("categories table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'categories'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'categories'
                        AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('categories_id_seq'::regclass)");
      });

      test("category_name", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'categories'
                          AND column_name = 'category_name';`
        );
        expect(column.column_name).toBe("category_name");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });
    });
  });

  describe("subcategories table", () => {
    test("subcategories table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'subcategories'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'subcategories'
                        AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('subcategories_id_seq'::regclass)");
      });

      test("category_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'subcategories'
                          AND column_name = 'category_id';`
        );
        expect(column.column_name).toBe("category_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("subcategory_name", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'subcategories'
                            AND column_name = 'subcategory_name';`
        );
        expect(column.column_name).toBe("subcategory_name");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });
    });

    describe("foreign keys", () => {
      test("category_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                  SELECT
                      conname AS constraint_name,
                      conrelid::regclass AS table_name,
                      a.attname AS column_name,
                      confrelid::regclass AS foreign_table_name,
                      af.attname AS foreign_column_name
                  FROM
                      pg_constraint AS c
                  JOIN
                      pg_attribute AS a ON a.attnum = ANY(c.conkey)
                  JOIN
                       pg_attribute AS af ON af.attnum = ANY(c.confkey)
                  WHERE
                       conrelid = 'subcategories'::regclass
                      AND a.attname = 'category_id'
                      AND confrelid = 'categories'::regclass;
                `);
        expect(column.foreign_table_name).toBe("categories");
        expect(column.foreign_column_name).toBe("oid");
      });
    });
  });

  describe("items table", () => {
    test("items table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'items'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'items'
                        AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('items_id_seq'::regclass)");
      });

      test("user_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'items'
                          AND column_name = 'user_id';`
        );
        expect(column.column_name).toBe("user_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("name", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'items'
                            AND column_name = 'name';`
        );
        expect(column.column_name).toBe("name");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("description", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'description';`
        );
        expect(column.column_name).toBe("description");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("tag", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'tag';`
        );
        expect(column.column_name).toBe("tag");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("category_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'category_id';`
        );
        expect(column.column_name).toBe("category_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("subcategory_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'subcategory_id';`
        );
        expect(column.column_name).toBe("subcategory_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("price", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'price';`
        );
        expect(column.column_name).toBe("price");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("date_listed", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'date_listed';`
        );
        expect(column.column_name).toBe("date_listed");
        expect(column.data_type).toBe("timestamp without time zone");
        expect(column.column_default).toBe("now()");
      });

      test("photo_description", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'photo_description';`
        );
        expect(column.column_name).toBe("photo_description");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("YES");
      });

      test("photo_source", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'photo_source';`
        );
        expect(column.column_name).toBe("photo_source");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("YES");
      });

      test("photo_link", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'photo_link';`
        );
        expect(column.column_name).toBe("photo_link");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("YES");
      });

      test("available_item", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'items'
                              AND column_name = 'available_item';`
        );
        expect(column.column_name).toBe("available_item");
        expect(column.data_type).toBe("boolean");
        expect(column.column_default).toBe("true");
        expect(column.is_nullable).toBe("YES");
      });
    });

    describe("foreign keys", () => {
      test("user_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'items'::regclass
                        AND a.attname = 'user_id'
                        AND confrelid = 'users'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("users");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("category_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                      SELECT
                          conname AS constraint_name,
                          conrelid::regclass AS table_name,
                          a.attname AS column_name,
                          confrelid::regclass AS foreign_table_name,
                          af.attname AS foreign_column_name
                      FROM
                          pg_constraint AS c
                      JOIN
                          pg_attribute AS a ON a.attnum = ANY(c.conkey)
                      JOIN
                           pg_attribute AS af ON af.attnum = ANY(c.confkey)
                      WHERE
                           conrelid = 'items'::regclass
                          AND a.attname = 'category_id'
                          AND confrelid = 'categories'::regclass;
                    `);
        expect(column.foreign_table_name).toBe("categories");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("subcategory_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                      SELECT
                          conname AS constraint_name,
                          conrelid::regclass AS table_name,
                          a.attname AS column_name,
                          confrelid::regclass AS foreign_table_name,
                          af.attname AS foreign_column_name
                      FROM
                          pg_constraint AS c
                      JOIN
                          pg_attribute AS a ON a.attnum = ANY(c.conkey)
                      JOIN
                           pg_attribute AS af ON af.attnum = ANY(c.confkey)
                      WHERE
                           conrelid = 'items'::regclass
                          AND a.attname = 'subcategory_id'
                          AND confrelid = 'subcategories'::regclass;
                    `);
        expect(column.foreign_table_name).toBe("subcategories");
        expect(column.foreign_column_name).toBe("oid");
      });
    });
  });

  describe("orders table", () => {
    test("orders table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'orders'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'orders'
                        AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('orders_id_seq'::regclass)");
      });

      test("buyer_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'orders'
                          AND column_name = 'buyer_id';`
        );
        expect(column.column_name).toBe("buyer_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("seller_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'orders'
                            AND column_name = 'seller_id';`
        );
        expect(column.column_name).toBe("seller_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("item_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'orders'
                            AND column_name = 'item_id';`
        );
        expect(column.column_name).toBe("item_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("pending_order", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'orders'
                            AND column_name = 'pending_order';`
        );
        expect(column.column_name).toBe("pending_order");
        expect(column.data_type).toBe("boolean");
        expect(column.column_default).toBe("true");
        expect(column.is_nullable).toBe("YES");
      });

      test("pending_feedback", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                            FROM information_schema.columns
                            WHERE table_name = 'orders'
                            AND column_name = 'pending_feedback';`
        );
        expect(column.column_name).toBe("pending_feedback");
        expect(column.data_type).toBe("boolean");
        expect(column.column_default).toBe("true");
        expect(column.is_nullable).toBe("YES");
      });

      test("date_ordered", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'orders'
                              AND column_name = 'date_ordered';`
        );
        expect(column.column_name).toBe("date_ordered");
        expect(column.data_type).toBe("timestamp without time zone");
        expect(column.column_default).toBe("now()");
        expect(column.is_nullable).toBe("YES");
      });
    });

    describe("foreign keys", () => {
      test("buyer_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'orders'::regclass
                        AND a.attname = 'buyer_id'
                        AND confrelid = 'users'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("users");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("seller_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'orders'::regclass
                        AND a.attname = 'seller_id'
                        AND confrelid = 'users'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("users");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("item_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'orders'::regclass
                        AND a.attname = 'item_id'
                        AND confrelid = 'items'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("items");
        expect(column.foreign_column_name).toBe("oid");
      });
    });
  });

  describe("feedback table", () => {
    test("feedback table exists", async () => {
      const {
        rows: [{ exists }],
      } = await db.query(
        `SELECT EXISTS (
            SELECT FROM 
                information_schema.tables 
            WHERE 
                table_name = 'feedback'
            );`
      );
      expect(exists).toBe(true);
    });

    describe("column names", () => {
      test("id as serial primary key", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default
                        FROM information_schema.columns
                        WHERE table_name = 'feedback'
                        AND column_name = 'id';`
        );
        expect(column.column_name).toBe("id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe("nextval('feedback_id_seq'::regclass)");
      });

      test("order_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'feedback'
                          AND column_name = 'order_id';`
        );
        expect(column.column_name).toBe("order_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("seller_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'feedback'
                          AND column_name = 'seller_id';`
        );
        expect(column.column_name).toBe("seller_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("buyer_id", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'feedback'
                          AND column_name = 'buyer_id';`
        );
        expect(column.column_name).toBe("buyer_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("rating", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'feedback'
                          AND column_name = 'rating';`
        );
        expect(column.column_name).toBe("rating");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("comment", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                          FROM information_schema.columns
                          WHERE table_name = 'feedback'
                          AND column_name = 'comment';`
        );
        expect(column.column_name).toBe("comment");
        expect(column.data_type).toBe("character varying");
        expect(column.column_default).toBe(null);
        expect(column.is_nullable).toBe("NO");
      });

      test("date_left", async () => {
        const {
          rows: [column],
        } = await db.query(
          `SELECT column_name, data_type, column_default, is_nullable
                              FROM information_schema.columns
                              WHERE table_name = 'feedback'
                              AND column_name = 'date_left';`
        );
        expect(column.column_name).toBe("date_left");
        expect(column.data_type).toBe("timestamp without time zone");
        expect(column.column_default).toBe("now()");
        expect(column.is_nullable).toBe("YES");
      });
    });

    describe("foreign keys", () => {
      test("order_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                        SELECT
                            conname AS constraint_name,
                            conrelid::regclass AS table_name,
                            a.attname AS column_name,
                            confrelid::regclass AS foreign_table_name,
                            af.attname AS foreign_column_name
                        FROM
                            pg_constraint AS c
                        JOIN
                            pg_attribute AS a ON a.attnum = ANY(c.conkey)
                        JOIN
                             pg_attribute AS af ON af.attnum = ANY(c.confkey)
                        WHERE
                             conrelid = 'feedback'::regclass
                            AND a.attname = 'order_id'
                            AND confrelid = 'orders'::regclass;
                      `);
        expect(column.foreign_table_name).toBe("orders");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("buyer_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'feedback'::regclass
                        AND a.attname = 'buyer_id'
                        AND confrelid = 'users'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("users");
        expect(column.foreign_column_name).toBe("oid");
      });

      test("seller_id", async () => {
        const {
          rows: [column],
        } = await db.query(`
                    SELECT
                        conname AS constraint_name,
                        conrelid::regclass AS table_name,
                        a.attname AS column_name,
                        confrelid::regclass AS foreign_table_name,
                        af.attname AS foreign_column_name
                    FROM
                        pg_constraint AS c
                    JOIN
                        pg_attribute AS a ON a.attnum = ANY(c.conkey)
                    JOIN
                         pg_attribute AS af ON af.attnum = ANY(c.confkey)
                    WHERE
                         conrelid = 'feedback'::regclass
                        AND a.attname = 'seller_id'
                        AND confrelid = 'users'::regclass;
                  `);
        expect(column.foreign_table_name).toBe("users");
        expect(column.foreign_column_name).toBe("oid");
      });
    });

    describe("properties", () => {
      test("seller_id !== buyer_id", async () => {
        const {
          rows: [constraint],
        } = await db.query(`
                SELECT
                  conname AS constraint_name,
                  pg_catalog.pg_get_constraintdef(c.oid) AS constraint_definition
                FROM
                  pg_constraint AS c
                WHERE
                  conrelid = 'feedback'::regclass
                  AND contype = 'c'
                  AND conname = 'different_users';
              `);
        expect(constraint).toBeDefined();

        expect(constraint.constraint_definition).toContain("CHECK ((seller_id <> buyer_id))");
      });
    });
  });

  describe("data insertion", () => {
    test("users data has been inserted correctly", async () => {
      const { rows: users } = await db.query(`SELECT * FROM users;`);
      expect(users).toHaveLength(8);
      users.forEach((user, i) => {
        expect(user).toHaveProperty("id", i + 1);
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("avatar_url", expect.any(String));
        expect(user).toHaveProperty("date_registered", expect.any(Date));
        expect(user).toHaveProperty("balance", expect.any(Number));
      });
    });

    test("categories data has been inserted correctly", async () => {
      const { rows: categories } = await db.query(`SELECT * FROM categories;`);
      expect(categories).toHaveLength(7);
      categories.forEach((category, i) => {
        expect(category).toHaveProperty("id", i + 1);
        expect(category).toHaveProperty("category_name", expect.any(String));
      });
    });

    test("subcategories data has been inserted correctly", async () => {
      const { rows: subcategories } = await db.query(`SELECT * FROM subcategories;`);
      expect(subcategories).toHaveLength(29);
      subcategories.forEach((subcategory, i) => {
        expect(subcategory).toHaveProperty("id", i + 1);
        expect(subcategory).toHaveProperty("category_id", expect.any(Number));
        expect(subcategory).toHaveProperty("subcategory_name", expect.any(String));
      });
    });

    test("items data has been inserted correctly", async () => {
      const { rows: items } = await db.query(`SELECT * FROM items;`);
      expect(items).toHaveLength(21);
      items.forEach((item, i) => {
        expect(item).toHaveProperty("id", i + 1);
        expect(item).toHaveProperty("user_id", expect.any(Number));
        expect(item).toHaveProperty("name", expect.any(String));
        expect(item).toHaveProperty("description", expect.any(String));
        expect(item).toHaveProperty("tag", expect.any(String));
        expect(item).toHaveProperty("category_id", expect.any(Number));
        expect(item).toHaveProperty("subcategory_id", expect.any(Number));
        expect(item).toHaveProperty("price", expect.any(Number));
        expect(item).toHaveProperty("date_listed", expect.any(Date));
        expect(item).toHaveProperty("photo_description", expect.any(String));
        expect(item).toHaveProperty("photo_source", expect.any(String));
        expect(item).toHaveProperty("photo_link", expect.any(String));
        expect(item).toHaveProperty("available_item", expect.any(Boolean));
      });
    });

    test("orders data has been inserted correctly", async () => {
      const { rows: orders } = await db.query(`SELECT * FROM orders;`);
      expect(orders).toHaveLength(8);
      orders.forEach((order, i) => {
        expect(order).toHaveProperty("id", i + 1);
        expect(order).toHaveProperty("buyer_id", expect.any(Number));
        expect(order).toHaveProperty("seller_id", expect.any(Number));
        expect(order).toHaveProperty("item_id", expect.any(Number));
        expect(order).toHaveProperty("pending_order", expect.any(Boolean));
        expect(order).toHaveProperty("pending_feedback", expect.any(Boolean));
        expect(order).toHaveProperty("date_ordered", expect.any(Date));
      });
    });

    test("feedback data has been inserted correctly", async () => {
      const { rows: feedback } = await db.query(`SELECT * FROM feedback;`);
      expect(feedback).toHaveLength(8);
      feedback.forEach((piece, i) => {
        expect(piece).toHaveProperty("id", i + 1);
        expect(piece).toHaveProperty("order_id", expect.any(Number));
        expect(piece).toHaveProperty("seller_id", expect.any(Number));
        expect(piece).toHaveProperty("buyer_id", expect.any(Number));
        expect(piece).toHaveProperty("rating", expect.any(Number));
        expect(piece).toHaveProperty("comment", expect.any(String));
        expect(piece).toHaveProperty("date_left", expect.any(Date));
      });
    });
  });
});
