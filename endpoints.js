export default {
  "example_user": {
    "id": 1,
    "username": "tech_guru92",
    "name": "John Doe",
    "avatar_url": "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
    "data_registered": "2022-05-14T00:00:00.000Z",
    "balance": 12050
  },
  "example_item": {
    "id": 1,
    "user_id": 1,
    "name": "Smartphone",
    "description": "Latest model smartphone with advanced features",
    "price": 50000,
    "date_listed": "2023-04-30T23:00:00.000Z",
    "available_item": true
  },
  "/api": {
    "GET": {
      "description": "serves up a json representation of all the available endpoints of the api",
      "exampleResponse": {
        "endpoints": "/api/users"
      }
    }
  },
  "/api/users": {
    "POST": {
      "description": "posts a new user to the database",
      "format": {
        "username": "tech_guru92",
        "name": "John Doe"
      },
      "optional": {
        "avatar_url": "link"
      },
      "exampleResponse": {
        "user": "example_user"
      }
    }
  },
  "/api/users/:user_id": {
    "GET": {
      "description": "gets the data of a user when given their id",
      "queries": [],
      "exampleResponse": {
        "user": "example_user"
      }
    },
    "PATCH": {
      "description": "updates the data of a user when given their id",
      "format": {
        "username": "tech_guru92",
        "name": "John Doe",
        "avatar_url": "link",
        "balance": 20000
      },
      "optional": "all keys optional",
      "exampleResponse": {
        "user": "example_user"
      }
    }
  },
  "/api/users/user_id/items": {
    "GET": {
      "description": "gets all items associated with a user",
      "exampleResponse": {
        "items": ["example_item", "example_item"]
      }
    },
    "POST": {
      "description": "posts a new item to the database for a user",
      "format": {
        "name": "Smartphone",
        "description": "Latest model smartphone with advanced features",
        "price": 50000
      },
      "exampleResponse": {
        "item": "example_item"
      }
    }
  },
  "/api/users/user_id/items/:item_id": {
    "PATCH": {
      "description": "updates the data of an item belonging to a user",
      "format": {
        "name": "iPhone",
        "description": "Brand new",
        "price": 60000
      },
      "optional": "all keys optional",
      "exampleResponse": {
        "item": "example_item"
      }
    }
  },
  "/api/items": {
    "GET": {
      "description": "gets an array of items from the database",
      "exampleResponse": {
        "items": ["example_item", "example_item"]
      }
    }
  },
  "/api/items/:item_id": {
    "GET": {
      "description": "gets the data of a single item",
      "exampleResponse": {
        "item": "example_item"
      }
    }
  }
}