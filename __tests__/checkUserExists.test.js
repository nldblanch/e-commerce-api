import checkUserExists from "../api/utils/checkUserExists.js";
import db from "../db/connection.js";

afterAll(async () => {
  await db.end();
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
    expect(actual).rejects.toEqual({
      code: 409,
      message: "conflict - username already taken",
    });
  });
});
