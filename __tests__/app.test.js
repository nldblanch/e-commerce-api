const { data } = require("../db/data/test");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
describe("", () => {
  test("", () => {});
});
