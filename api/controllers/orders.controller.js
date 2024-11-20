import { fetchOrder, fetchUserOrders } from "../models/orders.model.js";
import { fetchUserByID } from "../models/users.model.js";

const getOrderByID = async (request, response, next) => {
  const { order_id } = request.params;
  try {
    const order = await fetchOrder(order_id);
    response.status(200).send({ order });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    await fetchUserByID(user_id);
    const orders = await fetchUserOrders(user_id);
    response.status(200).send({ orders });
  } catch (error) {
    next(error);
  }
};

export { getOrderByID, getUserOrders };
