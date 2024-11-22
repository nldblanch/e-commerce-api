import { fetchItem } from "../models/items.model.js";
import { fetchOrder, fetchUserOrders, insertOrder, updateOrder } from "../models/orders.model.js";
import { fetchUserByID } from "../models/users.model.js";
import greenlist from "../utils/greenlist.js";
import strictGreenlist from "../utils/strictGreenlist.js";

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
    const orders = await fetchUserOrders(user_id);
    response.status(200).send({ orders });
  } catch (error) {
    next(error);
  }
};

const postOrder = async (request, response, next) => {
  const { user_id } = request.params;
  const { body } = request;
  try {
    const { order, item } = await insertOrder(user_id, body);
    response.status(201).send({ order, item });
  } catch (error) {
    next(error);
  }
};

const patchOrder = async (request, response, next) => {
  const { user_id, order_id } = request.params;
  const { body } = request;
  try {
    const order = await updateOrder(user_id, order_id, body);
    response.status(200).send({ order });
  } catch (error) {
    next(error);
  }
};

export { getOrderByID, getUserOrders, postOrder, patchOrder };
