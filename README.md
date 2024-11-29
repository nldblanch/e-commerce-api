# E-Commerce API Documentation

Welcome to the API documentation for my e-commerce app. This API is designed to handle various interactions between users and the items they buy or sell.

---

# Table of Contents

- [Live API Deployment](#live-api-deployment)
- [Key Features](#key-features)
- [Planned Features](#planned-features)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
  - [General Endpoints](#general-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Item Endpoints](#item-endpoints)
  - [Order Endpoints](#order-endpoints)
  - [Category Endpoints](#category-endpoints)
  - [Feedback Endpoints](#feedback-endpoints)
- [Testing](#testing)
- [Conclusion](#conclusion)

---

## Live API Deployment

The API is deployed and live! You can interact with the API via the following endpoint:

- [Live API Documentation](https://e-commerce-api-p5t2.onrender.com/api)

---

## Key Features

- **Efficient User Management**: Create, update, and retrieve user information with simple POST, GET, and PATCH requests.
- **Product Listings & Categories**: Easily list products, search by categories, subcategories, and tags.
- **Order Processing**: Handle the entire order flow — from placing orders to updating their status and providing feedback.
- **Flexible Querying**: Use filters like `category`, `price`, `sort_by`, and more to get exactly the data you need.

The API is fully tested and uses asynchronous JavaScript (async/await) for efficient handling of requests.

---

## Planned Features

- **Deleting Users**: A deleted user should cascade to items but not the feedback they've given. Instead, the feedback will be marked as anonymous.
- **Delete Items**: So that users can take down items for sale that haven't been purchased.
- **Auctioning Items**: I have no idea how to go about this but I'm very interested to try.

---

## Technologies Used

- **Express**: Server framework for Node.js, used to build the API.
- **JavaScript & Node.js**: JavaScript for backend logic; Node.js for server-side execution.
- **Async/Await**: Ensures non-blocking, easy-to-read asynchronous code.
- **Jest**: Used for unit testing to ensure code reliability.
- **Supertest**: A testing library for HTTP requests, used for testing the API endpoints in a clean way.
- **Seed Testing**: Involves seeding the database with initial test data to ensure the system works as expected, and running tests to verify the correctness and integrity of the seeded data.

---

## API Endpoints

### General Endpoints

#### `/api`

- **Method**: `GET`
- **Description**: Returns a list of all available API endpoints.
- **Example Response**:
  ```json
  {
    "endpoints": "/api/users"
  }
  ```

### User Endpoints

#### `/api/users`

- **Method**: `POST`
- **Description**: Create a new user.
- **Format**:
  ```json
  {
    "username": "tech_guru92",
    "name": "John Doe",
    "avatar_url": "link (optional)"
  }
  ```
- **Example Response**:
  ```json
  {
    "user": "example_user"
  }
  ```

#### `/api/users/:user_id`

- **Method**: `GET`
- **Description**: Retrieve user data by user ID.
- **Example Response**:

  ```json
  {
    "user": "example_user"
  }
  ```

- **Method**: `PATCH`
- **Description**: Update user data. All fields are optional.
- **Format**:
  ```json
  {
    "username": "new_username",
    "balance": 20000,
    "avatar_url": "new_link"
  }
  ```
- **Example Response**:
  ```json
  {
    "user": "example_user"
  }
  ```

---

### Item Endpoints

#### `/api/users/:user_id/items`

- **Method**: `GET`
- **Description**: Retrieve all items listed by a specific user.
- **Example Response**:

  ```json
  {
    "items": ["example_item", "example_item"]
  }
  ```

- **Method**: `POST`
- **Description**: List a new item for a user.
- **Format**:
  ```json
  {
    "name": "Smartphone",
    "description": "Latest model smartphone with advanced features",
    "price": 50000
  }
  ```
- **Example Response**:
  ```json
  {
    "item": "example_item"
  }
  ```

---

### Order Endpoints

#### `/api/users/:user_id/orders`

- **Method**: `GET`
- **Description**: Retrieve all orders made by the user.
- **Example Response**:

  ```json
  {
    "orders": "example_order"
  }
  ```

- **Method**: `POST`
- **Description**: Place a new order.
- **Format**:
  ```json
  {
    "item_id": 1,
    "seller_id": 1
  }
  ```
- **Example Response**:
  ```json
  {
    "order": "example_order"
  }
  ```

#### `/api/orders/:order_id`

- **Method**: `GET`
- **Description**: Retrieve order details by ID.
- **Example Response**:

  ```json
  {
    "order": "example_order"
  }
  ```

- **Method**: `PATCH`
- **Description**: Update the status of an order (e.g., mark it as pending or complete).
- **Format**:
  ```json
  {
    "pending_order": false
  }
  ```
- **Example Response**:
  ```json
  {
    "order": "example_order"
  }
  ```

---

### Category Endpoints

#### `/api/categories`

- **Method**: `GET`
- **Description**: Retrieve all product categories.
- **Example Response**:
  ```json
  {
    "categories": ["example_category"]
  }
  ```

#### `/api/categories/:category_id`

- **Method**: `GET`
- **Description**: Retrieve all subcategories for a specific category.
- **Example Response**:
  ```json
  {
    "subcategories": ["example_subcategory"]
  }
  ```

---

### Feedback Endpoints

#### `/api/orders/:order_id/feedback`

- **Method**: `GET`
- **Description**: Retrieve feedback left on an order.
- **Example Response**:

  ```json
  {
    "feedback": "example_feedback"
  }
  ```

- **Method**: `POST`
- **Description**: Submit feedback for an order.
- **Format**:
  ```json
  {
    "seller_id": 2,
    "buyer_id": 1,
    "rating": 5,
    "comment": "Great seller!"
  }
  ```
- **Example Response**:
  ```json
  {
    "feedback": "example_feedback"
  }
  ```

---

## Testing

This API is fully tested using **Jest** and **SuperTest**. All endpoints are covered by tests to ensure reliability and consistency across different environments.

To run the tests, clone the repository and run:

```bash
npm install
npm test
```

---

## Conclusion

This API demonstrates my ability to design and implement a functional e-commerce system using **JavaScript** and **Node.js**. By leveraging **asynchronous functions**, I've ensured that the API is efficient and scalable, making it easy to handle multiple requests concurrently without blocking the main thread.

Whether you're building a frontend for browsing products or a backend for managing users and orders, this API is designed to provide a responsive experience. My approach to clean, maintainable code ensures that the system can be extended and integrated with other services. With robust error handling and a flexible querying system, this API showcases my ability to deliver high-quality solutions with modern JavaScript practices.

---

### Note

This markdown is designed to showcase the most useful information, with key features called out for quick reference.
