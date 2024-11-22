export default {
  example_user: {
    id: 1,
    username: "tech_guru92",
    name: "John Doe",
    avatar_url: "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
    data_registered: "2022-05-14T00:00:00.000Z",
    balance: 12050,
  },
  example_item: {
    id: 1,
    user_id: 1,
    name: "Smartphone",
    description: "Latest model smartphone with advanced features",
    price: 50000,
    date_listed: "2023-04-30T23:00:00.000Z",
    available_item: true,
  },
  example_order: {
    id: 1,
    seller_id: 1,
    buyer_id: 2,
    item_id: 1,
    pending_order: true,
    pending_feedback: true,
    date_ordered: "2023-04-30T23:00:00.000Z",
  },
  example_category: {
    id: 1,
    category_name: "clothing_and_accessories",
  },
  example_subcategory: {
    id: 1,
    category_id: 1,
    subcategory_name: "womens_clothing",
  },
  example_feedback: {
    id: 4,
    order_id: 4,
    seller_id: 6,
    buyer_id: 7,
    rating: 3,
    comment: "Overall, the quality is nothing special and functions properly.",
    date_left: "2018-05-02T23:00:00.000Z",
  },
  "/api": {
    GET: {
      description: "serves up a json representation of all the available endpoints of the api",
      exampleResponse: {
        endpoints: "/api/users",
      },
    },
  },
  "/api/users": {
    POST: {
      description: "posts a new user to the database",
      format: {
        username: "tech_guru92",
        name: "John Doe",
      },
      optional: {
        avatar_url: "link",
      },
      exampleResponse: {
        user: "example_user",
      },
    },
  },
  "/api/users/:user_id": {
    GET: {
      description: "gets the data of a user when given their id",
      queries: [],
      exampleResponse: {
        user: "example_user",
      },
    },
    PATCH: {
      description: "updates the data of a user when given their id",
      format: {
        username: "tech_guru92",
        name: "John Doe",
        avatar_url: "link",
        balance: 20000,
      },
      optional: "all keys optional",
      exampleResponse: {
        user: "example_user",
      },
    },
  },
  "/api/users/user_id/items": {
    GET: {
      description: "gets all items associated with a user",
      exampleResponse: {
        items: ["example_item", "example_item"],
      },
    },
    POST: {
      description: "posts a new item to the database for a user",
      format: {
        name: "Smartphone",
        description: "Latest model smartphone with advanced features",
        price: 50000,
      },
      exampleResponse: {
        item: "example_item",
      },
    },
  },
  "/api/users/:user_id/orders": {
    GET: {
      description: "gets all orders a user has made",
      exampleResponse: { orders: "example_order" },
    },
    POST: {
      description: "posts a new order representing purchasing an item",
      format: { item_id: 1, seller_id: 1 },
      exampleResponse: { order: "example_order" },
    },
  },
  "/users/:user_id/feedback": {
    GET: {
      description: "gets all feedback a user has been given",
      exampleResponse: { feedback: ["example_feedback", "example_feedback"] },
    },
  },
  "/api/users/user_id/items/:item_id": {
    PATCH: {
      description: "updates the data of an item belonging to a user",
      format: {
        name: "iPhone",
        description: "Brand new",
        price: 60000,
      },
      optional: "all keys optional",
      exampleResponse: {
        item: "example_item",
      },
    },
  },
  "/api/users/user_id/orders/:order_id": {
    PATCH: {
      description: "updates the order status of an order",
      format: {
        pending_order: false,
      },
      exampleResponse: {
        order: "example_order",
      },
    },
  },
  "/api/items": {
    GET: {
      description: "gets an array of items from the database",
      queries: {
        category: {
          string: "category name",
          number: "id",
        },
        subcategory: {
          string: "subcategory name",
          number: "id",
        },
        tag: { string: "key word" },
        sort_by: {
          options: ["name", "price", "date_listed"],
          order: {
            options: ["asc", "desc"],
          },
          price_to: { number: "maximum price" },
          price_from: { number: "minimum price" },
        },
        exampleResponse: {
          items: ["example_item", "example_item"],
        },
      },
    },
  },
  "/api/items/:item_id": {
    GET: {
      description: "gets the data of a single item",
      exampleResponse: {
        item: "example_item",
      },
    },
  },
  "/api/categories": {
    GET: {
      description: "gets all categories",
      exampleResponse: {
        item: "example_category",
      },
    },
  },
  "/api/categories/:category_id": {
    GET: {
      description: "gets all subcategories of the given category id",
      exampleResponse: {
        item: ["example_subcategory", "example_subcategory"],
      },
    },
  },
  "/api/orders/:order_id": {
    GET: {
      description: "gets an order based on the given id",
      exampleResponse: {
        order: "example_order",
      },
    },
  },
};
