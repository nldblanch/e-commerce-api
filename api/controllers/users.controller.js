import { fetchUserByID, insertUser, updateUser } from "../models/users.model.js";

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
  try {
    const user = await updateUser(user_id, body);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

export { getUserByID, postUser, patchUser };
