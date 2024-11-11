const { data } = require("../db/data/test");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../api/app");
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
describe("/api", () => {
  test("200 GET: Api router returns endpoints", () => {
    const endpointsJSON = require("../endpoints.json");
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJSON);
      });
  });
});
