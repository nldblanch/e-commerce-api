import { fetchUserByID, insertUser, updateUser } from "../models/users.model.js";
import strictGreenlist from "../utils/strictGreenlist.js";
import greenlist from "../utils/greenlist.js";

const getUserByID = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    const user = await fetchUserByID(user_id);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

const postUser = async (request, response, next) => {
  const { body } = request;
  try {
    await strictGreenlist(["username", "name"], Object.keys(body));
    const user = await insertUser(body);
    response.status(201).send({ user });
  } catch (error) {
    if (error.code === "23505") {
      error = { code: 409, message: "conflict - username already taken" };
    }
    next(error);
  }
};

const patchUser = async (request, response, next) => {
  const { body } = request;
  const { user_id } = request.params;
  const entries = Object.entries(body);
  try {
    await greenlist(
      ["username", "name", "avatar_url", "balance"],
      Object.keys(body)
    );
    const user = await updateUser(user_id, entries);
    response.status(200).send({ user });
  } catch (error) {
    error.flag = "patch";
    next(error);
  }
};

export { getUserByID, postUser, patchUser };
