import { fetchAllItems, fetchItem } from "../models/items.model";

const getAllItems = async (request, response, next) => {
  try {
    const items = await fetchAllItems();
    response.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

const getItemByID = async (request, response, next) => {
  const { item_id } = request.params;
  try {
    const item = await fetchItem(item_id);
    response.status(200).send({ item });
  } catch (error) {
    next(error);
  }
};

export { getAllItems, getItemByID };
