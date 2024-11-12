import { fetchUserByID, insertUser } from "../models/users.model";
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
    await greenlist(["username", "name"], Object.keys(body));
    const user = await insertUser(body);
    response.status(201).send({ user });
  } catch (error) {
    next(error);
  }
};

export { getUserByID, postUser };
