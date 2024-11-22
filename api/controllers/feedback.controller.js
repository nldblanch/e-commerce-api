import { fetchUserFeedback, fetchFeedbackByOrderID, insertFeedback } from "../models/feedback.model.js";

const getUserFeedback = async (request, response, next) => {
  const { user_id } = request.params;
  const { query } = request;
  try {
    const feedback = await fetchUserFeedback(user_id, query);
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

const postFeedback = async (request, response, next) => {
  const { order_id } = request.params;
  const { body } = request;
  try {
    const feedback = await insertFeedback(order_id, body);
    response.status(201).send({ feedback });
  } catch (error) {
    next(error);
  }
};

export { getUserFeedback, getFeedbackByOrderID, postFeedback };
