import { fetchAllItems, fetchItem, insertItem } from "../models/items.model";
import { fetchUserByID } from "../models/users.model";
import strictGreenlist from "../utils/strictGreenlist";

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

const postItem = async (request, response, next) => {
  const { user_id } = request.params;
  const { body } = request;
  try {
    await strictGreenlist(["name", "description", "price"], Object.keys(body))
    await fetchUserByID(user_id)
    const item = await insertItem(user_id, body);    
    response.status(201).send({ item });
  } catch (error) {
    next(error);
  }
};

export { getAllItems, getItemByID, postItem };
