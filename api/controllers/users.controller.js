import { fetchUserByID, insertUser, updateUser } from "../models/users.model";
import strictGreenlist from "../utils/strictGreenlist";
import greenlist from "../utils/greenlist";

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
