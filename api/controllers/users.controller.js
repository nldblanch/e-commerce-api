const { fetchUserByID } = require("../models/users.model");

exports.getUserByID = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    const user = await fetchUserByID(user_id);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
