import data from "../db/data/test";
import request from "supertest";
import db from "../db/connection.js";
import seed from "../db/seeds/seed.js";
import app from "../api/app.js";
import endpointsJSON from "../endpoints.js";
beforeEach(async () => {
  try {
    await seed(data);
  } catch (error) {
    console.log(error);
  }
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("200 GET: returns endpoints", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);

    expect(endpoints).toEqual(endpointsJSON);
  });
});

describe("/api/users", () => {
  describe("/users", () => {
    describe("POST - add a new user", () => {
      test("201: adds user to database and returns user", async () => {
        const userData = { username: "nldblanch", name: "Nathan Blanch" };
        const {
          body: { user },
        } = await request(app).post("/api/users").send(userData).expect(201);
        expect(user).toMatchObject({
          id: expect.any(Number),
          username: userData.username,
          name: userData.name,
          avatar_url: expect.any(String),
          date_registered: expect.any(String),
          balance: 0,
        });
        const today = new Date();
        const dateRegistered = new Date(user.date_registered);
        expect(today.getUTCDate()).toBe(dateRegistered.getUTCDate());
      });

      test("400: request body missing keys", async () => {
        const userData = { name: "Nathan Blanch" };
        const {
          body: { message },
        } = await request(app).post("/api/users").send(userData).expect(400);
        expect(message).toBe("bad request - missing key");
      });

      test("400: request body has invalid keys", async () => {
        const userData = { person: "nldblanch", name: "Nathan Blanch" };
        const {
          body: { message },
        } = await request(app).post("/api/users").send(userData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("409: responds with conflict when username already taken", async () => {
        const userData = { username: "nldblanch", name: "Nathan Blanch" };
        const {
          body: { user },
        } = await request(app).post("/api/users").send(userData).expect(201);
        expect(user).toMatchObject(userData);
        const {
          body: { message },
        } = await request(app).post("/api/users").send(userData).expect(409);
        expect(message).toBe("conflict - username already taken");
      });
    });
  });

  describe("/users/:user_id", () => {
    describe("GET - get a user by their id", () => {
      test("200: responds with the user associated with the given id", async () => {
        const data1 = await request(app).get("/api/users/1").expect(200);
        const user1 = data1.body.user;
        expect(user1).toMatchObject({
          id: 1,
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
          date_registered: expect.any(String),
          balance: expect.any(Number),
        });

        const data2 = await request(app).get("/api/users/2").expect(200);
        const user2 = data2.body.user;
        expect(user2).toMatchObject({
          id: 2,
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
          date_registered: expect.any(String),
          balance: expect.any(Number),
        });
      });

      test("400: responds with bad request when given non number", async () => {
        const data = await request(app).get("/api/users/error").expect(400);
        const errorMessage = data.body.message;
        expect(errorMessage).toBe("bad request - invalid id");
      });

      test("404: responds with not found when user doesn't exist", async () => {
        const data = await request(app).get("/api/users/9000").expect(404);

        const errorMessage = data.body.message;
        expect(errorMessage).toBe("user id not found");
      });
    });

    describe("PATCH - update your profile", () => {
      test("200: can update username", async () => {
        const patchData = { username: "tech_guru99" };
        const {
          body: { user },
        } = await request(app).patch("/api/users/1").send(patchData).expect(200);
        expect(user).toMatchObject({
          username: "tech_guru99",
          id: 1,
        });
      });

      test("200: can update name", async () => {
        const patchData = { name: "Nathan" };
        const {
          body: { user },
        } = await request(app).patch("/api/users/1").send(patchData).expect(200);
        expect(user).toMatchObject({
          name: "Nathan",
          id: 1,
        });
      });

      test("200: can update avatar", async () => {
        const patchData = { avatar_url: "https://www.example.com" };
        const {
          body: { user },
        } = await request(app).patch("/api/users/1").send(patchData).expect(200);
        expect(user).toMatchObject({
          avatar_url: "https://www.example.com",
          id: 1,
        });
      });

      test("200: can update balance", async () => {
        const patchData = { balance: 20057 };
        const {
          body: { user },
        } = await request(app).patch("/api/users/1").send(patchData).expect(200);
        expect(user).toMatchObject({
          balance: 20057,
          id: 1,
        });
      });

      test("200: can update multiple values at once", async () => {
        const patchData = {
          username: "tech_guru99",
          name: "Nathan",
          avatar_url: "https://www.example.com",
          balance: 200000,
        };
        const {
          body: { user },
        } = await request(app).patch("/api/users/1").send(patchData).expect(200);
        expect(user).toMatchObject({
          id: 1,
          username: "tech_guru99",
          name: "Nathan",
          avatar_url: "https://www.example.com",
          balance: 200000,
        });
      });

      test("400: patch info missing keys", async () => {
        const patchData = {};
        const {
          body: { message },
        } = await request(app).patch("/api/users/1").send(patchData).expect(400);
        expect(message).toBe("bad request - no patch data");
      });

      test("400: patch info has invalid keys", async () => {
        const patchData = { nam: "Nathan" };
        const {
          body: { message },
        } = await request(app).patch("/api/users/1").send(patchData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("404: user id not found", async () => {
        const patchData = { name: "Nathan" };
        const {
          body: { message },
        } = await request(app).patch("/api/users/9000").send(patchData).expect(404);
        expect(message).toBe("user id not found");
      });
    });
  });

  describe("/users/:user_id/items", () => {
    describe("GET - all items associated with a user", () => {
      test("200: responds with an array of items", async () => {
        const {
          body: { items },
        } = await request(app).get("/api/users/1/items").expect(200);
        expect(items.length).toBeGreaterThan(0);
        items.forEach((item) => {
          expect(item).toMatchObject({
            id: expect.any(Number),
            user_id: 1,
            name: expect.any(String),
            description: expect.any(String),
            subcategory_id: expect.any(Number),
            price: expect.any(Number),
            date_listed: expect.any(String),
            photo_description: expect.any(String),
            photo_source: expect.any(String),
            photo_link: expect.any(String),
            available_item: expect.any(Boolean),
          });
        });
      });

      test("200: successful response when no items found but user exists", async () => {
        const userData = { username: "nldblanch", name: "Nathan Blanch" };
        const {
          body: { user },
        } = await request(app).post("/api/users").send(userData).expect(201);

        const {
          body: { items },
        } = await request(app).get(`/api/users/${user.id}/items`).expect(200);
        expect(items.length).toBe(0);
        expect(items).toEqual([]);
      });

      test("400: bad request - when given non number id", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/something/items`).expect(400);
        expect(message).toBe("bad request - invalid id");
      });

      test("404: not found when user id doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/9000/items`).expect(404);
        expect(message).toBe("user id not found");
      });
    });

    describe("POST - add a new item", () => {
      test("201: adds item to database and returns that item", async () => {
        const itemData = {
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
          tag: "laptop",
          category_id: 4,
          subcategory_id: 15,
          price: 50000,
          photo_description: "A person using a laptop computer on a table",
          photo_source:
            "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
          photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
        };
        const {
          body: { item },
        } = await request(app).post("/api/users/1/items").send(itemData).expect(201);
        expect(item).toMatchObject(itemData);
        expect(item).toMatchObject({
          id: expect.any(Number),
          user_id: 1,
          date_listed: expect.any(String),
          available_item: true,
        });
        const today = new Date();
        const dateListed = new Date(item.date_listed);
        expect(today.getUTCDate()).toBe(dateListed.getUTCDate());
      });

      test("400: request body missing keys", async () => {
        const itemData = {
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
        };
        const {
          body: { message },
        } = await request(app).post("/api/users/1/items").send(itemData).expect(400);
        expect(message).toBe("bad request - missing key");
      });

      test("400: request body has invalid keys", async () => {
        const itemData = {
          item: "Macbook Air 2020",
          description: "Used, but taken well care of",
          tag: "laptop",
          category_id: 4,
          subcategory_id: 15,
          price: 50000,
          photo_description: "A person using a laptop computer on a table",
          photo_source:
            "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
          photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
        };
        const {
          body: { message },
        } = await request(app).post("/api/users/1/items").send(itemData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("404: throws error when user id does not exist", async () => {
        const itemData = {
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
          tag: "laptop",
          category_id: 4,
          subcategory_id: 15,
          price: 50000,
          photo_description: "A person using a laptop computer on a table",
          photo_source:
            "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
          photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
        };
        const {
          body: { message },
        } = await request(app).post("/api/users/9000/items").send(itemData).expect(404);
        expect(message).toBe("user id not found");
      });
    });
  });

  describe("/users/:user_id/orders", () => {
    describe("GET - all orders a user has made", () => {
      test("200: responds with an array of orders", async () => {
        const {
          body: { orders },
        } = await request(app).get("/api/users/1/orders").expect(200);
        expect(orders.length).toBeGreaterThan(0);
        orders.forEach((order) => {
          expect(order).toMatchObject({
            id: expect.any(Number),
            buyer_id: 1,
            seller_id: expect.any(Number),
            item_id: expect.any(Number),
            pending_order: expect.any(Boolean),
            pending_feedback: expect.any(Boolean),
            date_ordered: expect.any(String),
          });
        });
      });

      test("200: successful response when no orders found but user exists", async () => {
        const userData = { username: "nldblanch", name: "Nathan Blanch" };
        const {
          body: { user },
        } = await request(app).post("/api/users").send(userData).expect(201);

        const {
          body: { orders },
        } = await request(app).get(`/api/users/${user.id}/orders`).expect(200);
        expect(orders.length).toBe(0);
        expect(orders).toEqual([]);
      });

      test("400: bad request - when given non number id", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/something/orders`).expect(400);
        expect(message).toBe("bad request - invalid id");
      });

      test("404: not found when user id doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/9000/orders`).expect(404);
        expect(message).toBe("user id not found");
      });
    });

    describe("POST - buy an item by posting a new order", () => {
      test("201: posts an item order to the database", async () => {
        const orderData = { item_id: 1, seller_id: 1 };
        const {
          body: { order },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(201);
        expect(order).toMatchObject({
          id: expect.any(Number),
          buyer_id: 2,
          seller_id: 1,
          item_id: 1,
          pending_order: true,
          pending_feedback: true,
          date_ordered: expect.any(String),
        });
        const today = new Date();
        const date_ordered = new Date(order.date_ordered);
        expect(today.getUTCDate()).toBe(date_ordered.getUTCDate());
      });

      test("201: posts an item order makes that item unavailable", async () => {
        const orderData = { item_id: 1, seller_id: 1 };
        const {
          body: { order },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(201);
        const {
          body: { item },
        } = await request(app).get("/api/items/1").expect(200);
        expect(item).toMatchObject({
          id: 1,
          user_id: 1,
          name: expect.any(String),
          description: expect.any(String),
          tag: expect.any(String),
          category_id: expect.any(Number),
          subcategory_id: expect.any(Number),
          price: expect.any(Number),
          date_listed: expect.any(String),
          photo_description: expect.any(String),
          photo_source: expect.any(String),
          photo_link: expect.any(String),
          available_item: false,
        });
      });

      test("201: posting an item order also returns that item", async () => {
        const orderData = { item_id: 1, seller_id: 1 };
        const {
          body: { item },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(201);

        expect(item).toMatchObject({ available_item: false });
      });

      test("concurrent orders do not allow purchase of the item", async () => {
        const orderData = { item_id: 1, seller_id: 1 };
        const {
          body: { order: purchase1 },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(201);
        const {
          body: { message: purchase2 },
        } = await request(app).post("/api/users/3/orders").send(orderData).expect(404);
        expect(purchase1).toMatchObject({
          id: expect.any(Number),
          buyer_id: 2,
          seller_id: 1,
          item_id: 1,
          pending_order: true,
          pending_feedback: true,
          date_ordered: expect.any(String),
        });
        expect(purchase2).toBe("item not available");
      });

      test("400: request body missing keys", async () => {
        const orderData = { item_id: 1 };
        const {
          body: { message },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(400);
        expect(message).toBe("bad request - missing key");
      });

      test("400: request body has invalid keys", async () => {
        const orderData = { item_id: 1, seller: 1 };
        const {
          body: { message },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("404: throws error when user id does not exist", async () => {
        const orderData = { item_id: 1, seller_id: 1 };
        const {
          body: { message },
        } = await request(app).post("/api/users/9000/orders").send(orderData).expect(404);

        expect(message).toBe("user id not found");
      });

      test("404: throws error when item not available", async () => {
        const orderData = { item_id: 4, seller_id: 6 };
        const {
          body: { message },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(404);

        expect(message).toBe("item not available");
      });

      test("409: responds with a conflict when seller associated with item does not match the seller id", async () => {
        const orderData = { item_id: 1, seller_id: 2 };
        const {
          body: { message },
        } = await request(app).post("/api/users/2/orders").send(orderData).expect(409);
        expect(message).toBe("conflict - seller id does not match item seller id");
      });
    });
  });

  describe("/users/:user_id/feedback", () => {
    describe("GET - all feedback on a user profile", () => {
      test("200: responds with an array containing the feedback", async () => {
        const {
          body: { feedback },
        } = await request(app).get("/api/users/6/feedback").expect(200);
        expect(feedback).toHaveLength(3);
        feedback.forEach((piece) => {
          expect(piece).toMatchObject({
            id: expect.any(Number),
            seller_id: 6,
            buyer_id: expect.any(Number),
            order_id: expect.any(Number),
            rating: expect.any(Number),
            comment: expect.any(String),
            date_left: expect.any(String),
          });
          expect(piece.rating).not.toBeGreaterThan(5);
          expect(piece.rating).not.toBeLessThan(1);
        });
      });

      test("200: successful response when no feedback found but user exists", async () => {
        const {
          body: { feedback },
        } = await request(app).get("/api/users/1/feedback").expect(200);
        expect(feedback).toHaveLength(0);
        expect(feedback).toEqual([]);
      });

      test("400: bad request - when given non number id", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/something/feedback`).expect(400);
        expect(message).toBe("bad request - invalid id");
      });

      test("404: not found when user id doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get(`/api/users/9000/feedback`).expect(404);
        expect(message).toBe("user id not found");
      });
    });
  });

  describe("/users/:user_id/items/:item_id", () => {
    describe("PATCH - update your item info", () => {
      test("200: can update item name", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { name: "NEW Macbook" };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item description", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          description: "Brand new only just taken out of the box but wrong colour",
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item price", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { price: 40000 };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item tag", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { tag: "apple products" };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item photo description", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { photo_description: "used macbook air, space grey" };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item photo source", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          photo_source:
            "https://images.unsplash.com/photo-1719937050445-098888c0625e?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxtYWNib29rfGVufDB8fHx8MTczMTg1ODMwMnww&ixlib=rb-4.0.3",
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item photo link", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          photo_link: "https://unsplash.com/photos/a-person-sitting-at-a-table-with-a-laptop-and-a-mouse-Tnm-287tzHQ",
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: can update item subcategory", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          subcategory_id: 16,
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("200: updating item subcategory updates main category", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          subcategory_id: 1,
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({
          ...macbook,
          ...patchData,
          category_id: 1,
        });
      });

      test("200: can update any number of values", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {
          name: "NEW Macbook",
          description: "Brand new only just taken out of the box but wrong colour",
          price: 40000,
        };

        const {
          body: { item },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(200);
        expect(item).toMatchObject({ ...macbook, ...patchData });
      });

      test("400: patch info missing keys", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = {};

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(400);
        expect(message).toBe("bad request - no patch data");
      });

      test("400: patch info has invalid keys", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { nam: "NEW Macbook" };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/items/${macbook.id}`).send(patchData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("404: user id not found", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { name: "NEW Macbook" };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/9000/items/${macbook.id}`).send(patchData).expect(404);
        expect(message).toBe("user id not found");
      });

      test("404: item id not found", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { name: "NEW Macbook" };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/items/9000`).send(patchData).expect(404);
        expect(message).toBe("item id not found");
      });

      test("403: user id does not match item user", async () => {
        const {
          body: { item: macbook },
        } = await request(app)
          .post("/api/users/1/items")
          .send({
            name: "Macbook Air 2020",
            description: "Used, but taken well care of",
            tag: "laptop",
            category_id: 4,
            subcategory_id: 15,
            price: 50000,
            photo_description: "A person using a laptop computer on a table",
            photo_source:
              "https://images.unsplash.com/photo-1719937206168-f4c829152b91?ixid=M3w2NzYxNTl8MXwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeXxlbnwwfHx8fDE3MzE3ODQ0NDF8MA&ixlib=rb-4.0.3",
            photo_link: "https://unsplash.com/photos/a-person-using-a-laptop-computer-on-a-table-AoDMssi2UOU",
          })
          .expect(201);

        const patchData = { name: "NEW Macbook" };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/2/items/${macbook.id}`).send(patchData).expect(403);
        expect(message).toBe("user id does not match user id associated with item");
      });
    });
  });

  describe("/users/:user_id/orders/order_id", () => {
    describe("PATCH: update the order", () => {
      test("200: can update order status", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = { pending_order: false };

        const {
          body: { order: updatedOrder },
        } = await request(app).patch(`/api/users/1/orders/${order.id}`).send(patchData).expect(200);
        expect(updatedOrder).toMatchObject({ ...order, ...updatedOrder });
      });

      test("400: patch info missing key", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = {};

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/orders/${order.id}`).send(patchData).expect(400);
        expect(message).toBe("bad request - missing key");
      });

      test("400: patch info has invalid key", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = { pending: false };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/orders/${order.id}`).send(patchData).expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });

      test("404: user id not found", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = { pending_order: false };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/9000/orders/${order.id}`).send(patchData).expect(404);
        expect(message).toBe("user id not found");
      });

      test("404: order id not found", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = { pending_order: false };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/1/orders/9000`).send(patchData).expect(404);
        expect(message).toBe("order id not found");
      });

      test("403: user id does not match order user", async () => {
        const orderData = { item_id: 2, seller_id: 2 };
        const {
          body: { order },
        } = await request(app).post("/api/users/1/orders").send(orderData).expect(201);

        const patchData = { pending_order: false };

        const {
          body: { message },
        } = await request(app).patch(`/api/users/2/orders/${order.id}`).send(patchData).expect(403);
        expect(message).toBe("user id does not match user id associated with order");
      });
    });
  });
});

describe("/api/items", () => {
  describe("/items", () => {
    describe("GET - get all items", () => {
      test("200: responds with an array of all items", async () => {
        const {
          body: { items },
        } = await request(app).get("/api/items").expect(200);
        expect(items.length).toBeGreaterThan(0);
        items.forEach((item) => {
          expect(item).toMatchObject({
            id: expect.any(Number),
            user_id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            tag: expect.any(String),
            category_id: expect.any(Number),
            subcategory_id: expect.any(Number),
            price: expect.any(Number),
            date_listed: expect.any(String),
            photo_description: expect.any(String),
            photo_source: expect.any(String),
            photo_link: expect.any(String),
            available_item: expect.any(Boolean),
          });
        });
      });

      test("200: responds with items which are available", async () => {
        const {
          body: { items },
        } = await request(app).get("/api/items").expect(200);
        items.forEach((item) => {
          expect(item).toMatchObject({
            available_item: true,
          });
        });
      });

      describe("queries", () => {
        describe("?category=", () => {
          test("200: clothing_and_accessories", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=clothing_and_accessories").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "clothing_and_accessories");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: beauty_and_personal_care", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=beauty_and_personal_care").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "beauty_and_personal_care");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: home_and_living", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=home_and_living").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "home_and_living");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: electronics_and_gadgets", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=electronics_and_gadgets").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "electronics_and_gadgets");
            expect(items.length).toBeGreaterThan(0);
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: food_and_beverages", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=food_and_beverages").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "food_and_beverages");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: toys_and_games", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=toys_and_games").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "toys_and_games");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: sports_and_outdoors", async () => {
            const {
              body: { categories },
            } = await request(app).get("/api/categories");
            const {
              body: { items },
            } = await request(app).get("/api/items?category=sports_and_outdoors").expect(200);
            const [{ id }] = categories.filter((category) => category.category_name === "sports_and_outdoors");
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: id,
              });
            });
          });

          test("200: category parameter can also take number value representing id", async () => {
            const {
              body: { items },
            } = await request(app).get("/api/items?category=1").expect(200);
            items.forEach((item) => {
              expect(item).toMatchObject({
                category_id: 1,
              });
            });
          });

          test("404: category doesn't exist", async () => {
            const {
              body: { message },
            } = await request(app).get("/api/items?category=1000").expect(404);
            expect(message).toBe("no items found");
          });
        });

        describe("?subcategory=", () => {
          test("200: can filter by subcategory", async () => {
            const {
              body: { subcategories },
            } = await request(app).get("/api/categories/1");

            const {
              body: { items },
            } = await request(app).get("/api/items?subcategory=kids_clothing").expect(200);
            const [{ id }] = subcategories.filter((subcategory) => subcategory.subcategory_name === "kids_clothing");
            items.forEach((item) => {
              expect(item).toMatchObject({
                subcategory_id: id,
              });
            });
          });

          test("200: subcategory parameter can also take number value representing id", async () => {
            const {
              body: { items },
            } = await request(app).get("/api/items?subcategory=3").expect(200);
            items.forEach((item) => {
              expect(item).toMatchObject({
                subcategory_id: 3,
              });
            });
          });

          test("404: subcategory doesn't exist", async () => {
            const {
              body: { message },
            } = await request(app).get("/api/items?subcategory=1000").expect(404);
            expect(message).toBe("no items found");
          });
        });

        describe("?tag=", () => {
          test("200: respond with all results matching search term", async () => {
            const {
              body: { items: items1 },
            } = await request(app).get("/api/items?tag=laptop").expect(200);
            items1.forEach(({ tag: itemTag }) => {
              expect(itemTag.includes("laptop")).toBe(true);
            });
            const {
              body: { items: items2 },
            } = await request(app).get("/api/items?tag=nuts").expect(200);
            items2.forEach((item) => {
              expect(item).toMatchObject({
                tag: "nuts",
              });
            });
          });

          test("404: responds not found when tag doesn't exist", async () => {
            const {
              body: { message },
            } = await request(app).get("/api/items?tag=nathan").expect(404);
            expect(message).toBe("no items found");
          });
        });

        describe("sort_by & order", () => {
          describe("?sort_by=", () => {
            test("200: sorts by name", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?sort_by=name").expect(200);
              expect(items).toBeSortedBy("name", { ascending: true });
            });

            test("200: sorts by price", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?sort_by=price").expect(200);
              expect(items).toBeSortedBy("price", { ascending: true });
            });

            test("200: sorts by date_listed", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?sort_by=date_listed").expect(200);
              expect(items).toBeSortedBy("date_listed", { ascending: true });
            });

            test("400: bad request when invalid sort by parameter", async () => {
              const {
                body: { message },
              } = await request(app).get("/api/items?sort_by=invalid_sort_by").expect(400);
              expect(message).toBe("invalid query parameter");
            });
          });

          describe("?order=", () => {
            test("200: sorts ascending", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?order=asc").expect(200);
              expect(items).toBeSortedBy("name", { ascending: true });
            });

            test("200: sorts descending", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?order=desc").expect(200);
              expect(items).toBeSortedBy("name", { descending: true });
            });

            test("400: bad request when invalid order parameter", async () => {
              const {
                body: { message },
              } = await request(app).get("/api/items?order=invalid_sort_by").expect(400);
              expect(message).toBe("invalid query parameter");
            });
          });

          describe("default", () => {
            test("200: sorts by name, order ascending", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items").expect(200);
              expect(items).toBeSortedBy("name", { ascending: true });
            });
          });
        });

        describe("?price", () => {
          describe("?price_from=", () => {
            test("200: respond with results greater than the price", async () => {
              const {
                body: { items: items1 },
              } = await request(app).get("/api/items?price_from=2000").expect(200);
              items1.forEach(({ price }) => {
                expect(price).not.toBeLessThan(2000);
              });
              const {
                body: { items: items2 },
              } = await request(app).get("/api/items?price_from=20000").expect(200);
              items2.forEach(({ price }) => {
                expect(price).not.toBeLessThan(20000);
              });
            });

            test("404: responds not found when no items found", async () => {
              const {
                body: { message },
              } = await request(app).get("/api/items?price_from=20000000").expect(404);
              expect(message).toBe("no items found");
            });
          });

          describe("?price_to=", () => {
            test("200: respond with results less than the price", async () => {
              const {
                body: { items: items1 },
              } = await request(app).get("/api/items?price_to=2000").expect(200);
              items1.forEach(({ price }) => {
                expect(price).not.toBeGreaterThan(2000);
              });
              const {
                body: { items: items2 },
              } = await request(app).get("/api/items?price_to=20000").expect(200);
              items2.forEach(({ price }) => {
                expect(price).not.toBeGreaterThan(20000);
              });
            });

            test("404: responds not found when no items found", async () => {
              const {
                body: { message },
              } = await request(app).get("/api/items?price_to=0").expect(404);
              expect(message).toBe("no items found");
            });
          });

          describe("?price_from=&price_to=", () => {
            test("200: respond with results in the given price range", async () => {
              const {
                body: { items },
              } = await request(app).get("/api/items?price_from=10000&price_to=15000").expect(200);
              items.forEach(({ price }) => {
                expect(price).not.toBeGreaterThan(15000);
                expect(price).not.toBeLessThan(10000);
              });
            });
          });
        });
      });
    });
  });

  describe("/items/:item_id", () => {
    describe("GET - get individual item", () => {
      test("200: responds with item matching the given id", async () => {
        const {
          body: { item },
        } = await request(app).get("/api/items/1").expect(200);
        expect(item).toMatchObject({
          id: 1,
          user_id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          tag: expect.any(String),
          category_id: expect.any(Number),
          subcategory_id: expect.any(Number),
          price: expect.any(Number),
          date_listed: expect.any(String),
          photo_description: expect.any(String),
          photo_source: expect.any(String),
          photo_link: expect.any(String),
          available_item: expect.any(Boolean),
        });
      });

      test("400: responds with bad request when given non number", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/items/error").expect(400);

        expect(message).toBe("bad request - invalid id");
      });

      test("404: responds with not found when item doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/items/9000").expect(404);

        expect(message).toBe("item id not found");
      });
    });
  });
});

describe("/api/categories", () => {
  describe("/categories", () => {
    describe("GET - all categories", () => {
      test("200: responds with an array of all categories", async () => {
        const {
          body: { categories },
        } = await request(app).get("/api/categories").expect(200);
        expect(categories.length).toBeGreaterThan(0);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            id: expect.any(Number),
            category_name: expect.any(String),
          });
        });
      });
    });
  });

  describe("/categories/:category_id", () => {
    describe("GET - all subcategories associated with a category", () => {
      test("200: responds with an array of all categories", async () => {
        const {
          body: { subcategories },
        } = await request(app).get("/api/categories/1").expect(200);
        expect(subcategories.length).toBeGreaterThan(0);
        subcategories.forEach((subcategory) => {
          expect(subcategory).toMatchObject({
            id: expect.any(Number),
            category_id: 1,
            subcategory_name: expect.any(String),
          });
        });
      });

      test("400: responds with bad request when given non number", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/categories/error").expect(400);
        expect(message).toBe("bad request - invalid id");
      });

      test("404: responds with an array of all categories", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/categories/100").expect(404);
        expect(message).toBe("category id not found");
      });
    });
  });
});

describe("/api/orders", () => {
  describe("/orders/:order_id", () => {
    describe("GET: a specific order by id", () => {
      test("200: responds with order matching the given id", async () => {
        const {
          body: { order },
        } = await request(app).get("/api/orders/1").expect(200);
        expect(order).toMatchObject({
          id: 1,
          buyer_id: expect.any(Number),
          seller_id: expect.any(Number),
          item_id: expect.any(Number),
          pending_order: expect.any(Boolean),
          pending_feedback: expect.any(Boolean),
          date_ordered: expect.any(String),
        });
      });

      test("400: responds with bad request when given non number", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/orders/error").expect(400);

        expect(message).toBe("bad request - invalid id");
      });

      test("404: responds with not found when order doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/orders/9000").expect(404);

        expect(message).toBe("order id not found");
      });
    });
  });

  describe("/orders/:order_id/feedback", () => {
    describe("GET - the feedback a user gave after an order", () => {
      test("200: responds with the feedback", async () => {
        const {
          body: { feedback },
        } = await request(app).get("/api/orders/1/feedback");
        expect(feedback).toMatchObject({
          id: expect.any(Number),
          seller_id: expect.any(Number),
          buyer_id: expect.any(Number),
          order_id: 1,
          rating: expect.any(Number),
          comment: expect.any(String),
          date_left: expect.any(String),
        });
      });

      test("400: responds with bad request when given non number", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/orders/error/feedback").expect(400);

        expect(message).toBe("bad request - invalid id");
      });

      test("404: responds with not found when order doesn't exist", async () => {
        const {
          body: { message },
        } = await request(app).get("/api/orders/9000/feedback").expect(404);

        expect(message).toBe("order id not found");
      });
    });
  });
});
