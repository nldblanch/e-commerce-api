import { fetchAllItems, fetchItem, insertItem, updateItem, fetchUserItems } from "../models/items.model.js";

const getAllItems = async (request, response, next) => {
  const { query } = request;

  try {
    const items = await fetchAllItems(query);
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
    const item = await insertItem(user_id, body);
    response.status(201).send({ item });
  } catch (error) {
    next(error);
  }
};

const patchItem = async (request, response, next) => {
  const { user_id, item_id } = request.params;
  const { body } = request;
  try {
    const item = await updateItem(user_id, item_id, body);
    response.status(200).send({ item });
  } catch (error) {
    next(error);
  }
};

const getUserItems = async (request, response, next) => {
  const { user_id } = request.params;
  try {
    const items = await fetchUserItems(user_id);
    response.status(200).send({ items });
  } catch (error) {
    next(error);
  }
};

export { getAllItems, getItemByID, postItem, patchItem, getUserItems };
