import { fetchAllCategories, fetchSubcategories } from "../models/categories.model.js";

const getAllCategories = async (request, response, next) => {
  try {
    const categories = await fetchAllCategories();
    response.status(200).send({ categories });
  } catch (error) {
    next(error);
  }
};
const getSubcategories = async (request, response, next) => {
  const { category_id } = request.params;
  try {
    const subcategories = await fetchSubcategories(category_id);
    response.status(200).send({ subcategories });
  } catch (error) {
    next(error);
  }
};

export { getAllCategories, getSubcategories };
