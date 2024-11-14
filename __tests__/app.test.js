import { users, items, feedback } from "../db/data/test";
import request from "supertest";
import db from "../db/connection.js";
import seed from "../db/seeds/seed.js";
import app from "../api/app.js";
import endpointsJSON from "../endpoints.json";
beforeEach(async () => {
  const data = { users, items, feedback };
  try {
    await seed(data);
  } catch (error) {
    console.log(error)
  }
    
});

afterAll(async () => {
  await db.end();
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
    describe("POST", () => {
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
        const userData = { username: "tech_guru92", name: "Nathan Blanch" };
        const {
          body: { message },
        } = await request(app).post("/api/users").send(userData).expect(409);
        expect(message).toBe("conflict - username already taken");
      });
    });
  });
  describe("/users/:user_id", () => {
    describe("GET", () => {
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
    describe("PATCH", () => {
      test("200: can update username", async () => {
        const patchData = { username: "tech_guru99" };
        const {
          body: { user },
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(200);
        expect(user).toMatchObject({
          username: "tech_guru99",
          id: 1,
        });
      });
      test("200: can update name", async () => {
        const patchData = { name: "Nathan" };
        const {
          body: { user },
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(200);
        expect(user).toMatchObject({
          name: "Nathan",
          id: 1,
        });
      });
      test("200: can update avatar", async () => {
        const patchData = { avatar_url: "https://www.example.com" };
        const {
          body: { user },
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(200);
        expect(user).toMatchObject({
          avatar_url: "https://www.example.com",
          id: 1,
        });
      });
      test("200: can update balance", async () => {
        const patchData = { balance: 20057 };
        const {
          body: { user },
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(200);
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
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(200);
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
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(400);
        expect(message).toBe("bad request - no patch data");
      });
      test("400: patch info has invalid keys", async () => {
        const patchData = { nam: "Nathan" };
        const {
          body: { message },
        } = await request(app)
          .patch("/api/users/1")
          .send(patchData)
          .expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });
      test("404: user id not found", async () => {
        const patchData = { name: "Nathan" };
        const {
          body: { message },
        } = await request(app)
          .patch("/api/users/9000")
          .send(patchData)
          .expect(404);
        expect(message).toBe("user id not found");
      });
    });
  });

  describe("/users/:user_id/items", () => {
    describe("POST", () => {
      test("201: adds item to database and returns that item", async () => {
        const itemData = {
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
          price: 50000,
        };
        const {
          body: { item },
        } = await request(app)
          .post("/api/users/1/items")
          .send(itemData)
          .expect(201);
        expect(item).toMatchObject({
          id: expect.any(Number),
          user_id: 1,
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
          price: 50000,
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
        } = await request(app)
          .post("/api/users/1/items")
          .send(itemData)
          .expect(400);
        expect(message).toBe("bad request - missing key");
      });
      test("400: request body has invalid keys", async () => {
        const itemData = {
          item: "Macbook Air 2020",
          description: "Used, but taken well care of",
          price: 50000
        };
        const {
          body: { message },
        } = await request(app)
          .post("/api/users/1/items")
          .send(itemData)
          .expect(400);
        expect(message).toBe("bad request - invalid key or value");
      });
      test("404: throwd error when user id does not exist", async () => {
        const itemData = {
          name: "Macbook Air 2020",
          description: "Used, but taken well care of",
          price: 50000
        };
        const {
          body: { message },
        } = await request(app)
          .post("/api/users/9000/items")
          .send(itemData)
          .expect(404);
        expect(message).toBe("user id not found");
      })
    });
  });
});

describe("/api/items", () => {
  describe("/items", () => {
    describe("GET", () => {
      test("200: responds with an array of all items", async () => {
        const {
          body: { items },
        } = await request(app).get("/api/items").expect(200);
        expect(items.length).toBeGreaterThan(0);
        expect(items[0]).toMatchObject({
          id: 1,
          user_id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          date_listed: expect.any(String),
          available_item: expect.any(Boolean),
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
    });
  });

  describe("/items/:item_id", () => {
    describe("GET", () => {
      test("200: responds with item matching the given id", async () => {
        const {
          body: { item },
        } = await request(app).get("/api/items/1").expect(200);
        expect(item).toMatchObject({
          id: 1,
          user_id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          date_listed: expect.any(String),
          available_item: expect.any(Boolean),
        });
      });
      test("400: responds with bad request when given non number", async () => {
        const data = await request(app).get("/api/items/error").expect(400);
        const errorMessage = data.body.message;
        expect(errorMessage).toBe("bad request - invalid id");
      });
      test("404: responds with not found when item doesn't exist", async () => {
        const data = await request(app).get("/api/items/9000").expect(404);

        const errorMessage = data.body.message;
        expect(errorMessage).toBe("item id not found");
      });
    });
  });
});
