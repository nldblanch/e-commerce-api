import { users, items, feedback } from "../db/data/test";
import request from "supertest";
import db from "../db/connection";
import seed from "../db/seeds/seed";
import app from "../api/app";
import endpointsJSON from "../endpoints.json";

beforeEach(() => {
  const data = { users, items, feedback };
  return seed(data);
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

describe("/api/users/:user_id", () => {
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
        balance: expect.any(String),
      });
      expect(Number(user1.balance)).not.toBe(NaN);

      const data2 = await request(app).get("/api/users/2").expect(200);
      const user2 = data2.body.user;
      expect(user2).toMatchObject({
        id: 2,
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
        date_registered: expect.any(String),
        balance: expect.any(String),
      });
      expect(Number(user2.balance)).not.toBe(NaN);
    });
    test("400: responds with bad request when given non number", async () => {
      const data = await request(app).get("/api/users/error").expect(400);
      const errorMessage = data.body.message;
      expect(errorMessage).toBe("bad request - column does not exist");
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
      const patchData = { balance: "200.57" };
      const {
        body: { user },
      } = await request(app).patch("/api/users/1").send(patchData).expect(200);
      expect(user).toMatchObject({
        balance: "200.57",
        id: 1,
      });
    });
    test("200: can update multiple values at once", async () => {
      const patchData = {
        username: "tech_guru99",
        name: "Nathan",
        avatar_url: "https://www.example.com",
        balance: "2000",
      };
      const {
        body: { user },
      } = await request(app).patch("/api/users/1").send(patchData).expect(200);
      expect(user).toMatchObject({
        id: 1,
        username: "tech_guru99",
        name: "Nathan",
        avatar_url: "https://www.example.com",
        balance: "2000",
      });
    });
    test("400: patch info missing keys", async () => {
      const patchData = {};
      const {
        body: { message },
      } = await request(app).patch("/api/users/1").send(patchData).expect(400);
      expect(message).toBe("bad request - no patch data")
    })
    test("400: patch info has invalid keys", async () => {
      const patchData = {nam: "Nathan"};
      const {
        body: { message },
      } = await request(app).patch("/api/users/1").send(patchData).expect(400);
      expect(message).toBe("bad request - invalid key or value")
    })
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

describe("/api/users", () => {
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
        balance: "0",
      })
      const today = new Date()
      const dateRegistered = new Date(user.date_registered)
      expect(today.getUTCDate()).toBe(dateRegistered.getUTCDate())
    });
    test("400: request body missing keys", async () => {
      const userData = { name: "Nathan Blanch" };
      const {
        body: { message },
      } = await request(app).post("/api/users").send(userData).expect(400);
      expect(message).toBe("bad request - missing key")
    })
    test("400: request body has invalid keys", async () => {
      const userData = { person: "nldblanch", name: "Nathan Blanch" };
      const {
        body: { message },
      } = await request(app).post("/api/users").send(userData).expect(400);
      expect(message).toBe("bad request - invalid key or value")
    })
    test("409: responds with conflict when username already taken", async () => {
      const userData = { username: "tech_guru92", name: "Nathan Blanch" };
      const {
        body: { message },
      } = await request(app).post("/api/users").send(userData).expect(409);
      expect(message).toBe("conflict - username already taken");
    });
  });
});
