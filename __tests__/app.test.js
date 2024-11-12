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
  test("200 GET: Api router returns endpoints", async () => {
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
});
