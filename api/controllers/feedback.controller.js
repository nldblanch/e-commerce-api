import { fetchUserFeedback, fetchFeedbackByOrderID } from "../models/feedback.model.js";

const getUserFeedback = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    const feedback = await fetchUserFeedback(user_id);
    response.status(200).send({ feedback });
  } catch (error) {
    next(error);
  }
};

const getFeedbackByOrderID = async (request, response, next) => {
  const { order_id } = request.params;
  try {
    const feedback = await fetchFeedbackByOrderID(order_id);
    response.status(200).send({ feedback });
  } catch (error) {
    next(error);
  }
};

export { getUserFeedback, getFeedbackByOrderID };
