import { strictGreenlist } from "../api/utils/index.js";

describe("strictGreenlist", () => {
  test("returns a promise", async () => {
    //arrange
    const array = [1, 2, 3, 4, 5];
    const greenlistArr = [1, 2, 3, 4, 5];
    //act
    const actual = strictGreenlist(greenlistArr, array);
    //assert
    expect(actual).toBeInstanceOf(Promise);
  });
  test("promise resolves when array matches greenlist", async () => {
    //arrange
    const array = [1, 2, 3, 4, 5];
    const greenlistArr = [1, 2, 3, 4, 5];
    //act
    const actual = strictGreenlist(greenlistArr, array);
    //assert
    expect(actual).resolves.toBe("successful greenlist");
  });
  test("promise rejects when array lengths do not match", async () => {
    //arrange
    const array = [1, 2, 3];
    const greenlistArr = [1, 2, 3, 4, 5];
    //act
    const actual = strictGreenlist(greenlistArr, array);
    //assert
    expect(actual).rejects.toEqual({ code: 400, message: "bad request - missing key" });
  });
  test("promise rejects when array does not match greenlist", async () => {
    //arrange
    const array = [1, 2, 3, 4, 6];
    const greenlistArr = [1, 2, 3, 4, 5];
    //act
    const actual = strictGreenlist(greenlistArr, array);
    //assert
    expect(actual).rejects.toEqual({ code: 400, message: "bad request - invalid key or value" });
  });
  test("function does not mutate arrays", async () => {
    //arrange
    const array = [1, 2, 3, 4, 5];
    const greenlistArr = [1, 2, 3, 4, 5];
    const arrayCopy = [1, 2, 3, 4, 5];
    const greenlistArrCopy = [1, 2, 3, 4, 5];
    //act
    await strictGreenlist(greenlistArr, array);
    //assert
    expect(array).toEqual(arrayCopy);
    expect(greenlistArr).toEqual(greenlistArrCopy);
  });
});
