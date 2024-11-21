import { fetchItem } from "../models/items.model.js";
import { fetchOrder, fetchUserOrders, insertOrder } from "../models/orders.model.js";
import { fetchUserByID } from "../models/users.model.js";
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
    await fetchUserByID(user_id);
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
    await strictGreenlist(["item_id", "seller_id"], Object.keys(body));
    await fetchUserByID(user_id);
    const item = await fetchItem(body.item_id);
    if (item.user_id !== body.seller_id)
      next({ code: 409, message: "conflict - seller id does not match item seller id" });
    const order = await insertOrder(user_id, body);
    response.status(201).send({ order });
  } catch (error) {
    next(error);
  }
};

export { getOrderByID, getUserOrders, postOrder };
