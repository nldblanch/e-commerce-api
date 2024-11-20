import { fetchOrder } from "../models/orders.model.js";

const getOrderByID = async (request, response, next) => {
  const { order_id } = request.params;
  try {
    const order = await fetchOrder(order_id);
    response.status(200).send({ order });
  } catch (error) {
    next(error);
  }
};

export { getOrderByID };
