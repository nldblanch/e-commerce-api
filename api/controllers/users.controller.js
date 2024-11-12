import fetchUserByID from "../models/users.model";

const getUserByID = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    const user = await fetchUserByID(user_id);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

export default getUserByID;
