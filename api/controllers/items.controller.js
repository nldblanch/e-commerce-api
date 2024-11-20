import { fetchCategoryFromSubcategory } from "../models/categories.model.js";
import {
  fetchAllItems,
  fetchItem,
  insertItem,
  updateItem,
  fetchUserItems
} from "../models/items.model.js";
import { fetchUserByID } from "../models/users.model.js";
import greenlist from "../utils/greenlist.js";
import strictGreenlist from "../utils/strictGreenlist.js";

const getAllItems = async (request, response, next) => {
  const {query} = request;
  const {sort_by, order} = query
  try {
    if (sort_by) {
      await greenlist(["name", "price", "date_listed"], [sort_by])
    }
    if (order) {
      await greenlist(["asc", "desc"], [order])
    }
    const items = await fetchAllItems(query);
    response.status(200).send({ items });
  } catch (error) {
    if (error.message === "bad request - invalid key or value") {
      error.message = "invalid query parameter"
    }
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
    await strictGreenlist(
      [
        "name",
        "description",
        "price",
        "tag",
        "category_id",
        "subcategory_id",
        "photo_description",
        "photo_source",
        "photo_link",
      ],
      Object.keys(body)
    );
    await fetchUserByID(user_id);
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
    await greenlist(
      [
        "name",
        "description",
        "price",
        "tag",
        "category_id",
        "subcategory_id",
        "photo_description",
        "photo_source",
        "photo_link",
      ],
      Object.keys(body)
    );
    await fetchUserByID(user_id);
    const entries = Object.entries(body)
    if (body.subcategory_id) {
      const {category_id} = await fetchCategoryFromSubcategory(body.subcategory_id) 
      entries.push(["category_id", category_id])
    }
    const item = await updateItem(user_id, item_id, entries);
    response.status(200).send({ item });
  } catch (error) {
    next(error);
  }
};

const getUserItems = async (request, response, next) => {
    const { user_id } = request.params;
    try {
        await fetchUserByID(user_id);
        const items = await fetchUserItems(user_id);
        response.status(200).send({ items });
      } catch (error) {
        next(error);
      }
}

export { getAllItems, getItemByID, postItem, patchItem, getUserItems };
