import checkUserExists from "../api/utils/checkUserExists";
import { feedback, items, users } from "../db/data/test";
import seed from "../db/seeds/seed";
import db from "../db/connection";

beforeEach(() => {
  const data = { users, items, feedback };
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("checkUserExists", () => {
  test("returns a promise", async () => {
    //arrange
    const username = "nldblanch";
    //act
    const actual = checkUserExists(username);
    //assert
    expect(actual).toBeInstanceOf(Promise);
  });
  test("promise resolves when username does not exist", async () => {
    //arrange
    const username = "nldblanch";
    //act
    const actual = checkUserExists(username);
    //assert
    expect(actual).resolves.toBe();
  });
  test("promise rejects when username exists", async () => {
    //arrange
    const username = "tech_guru92";
    //act
    const actual = checkUserExists(username);
    //assert
    expect(actual).rejects.toBe({
      code: 409,
      message: "conflict - username already taken",
    });
  });
});
