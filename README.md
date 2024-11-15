# E-Commerce API

## Intro

Hello! Welcome to the beginning of this api. Here is a great space for us to leave comments and updates about the project. 

## Planned endpoints

### /users/:user_id

#### Get - DONE

A users data is in the format:
```
{
    id: 1,
    username: "tech_guru92",
    name: "John Doe,
    avatar_url: 'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon',
    date_registered: "2022-05-14T00:00:00.000Z",
    balance: 120.5
}
```

#### Patch

Patchable keys: username, name, avatar, balance

### /users

#### Post - DONE, no endpoint
- The user id is a serial primary key.
- There is a default avatar_url for users.
- The registration date will default to `TIMESTAMP DEFAULT NOW()`.

Therefore the user data for a post must be in the format:
```
{
    username: "nldblanch",
    name: "Nathan Blanch"
}
```

#### Get all items of a user
- essentially their store 

# Next features


#### purchase an item


#### Queries

Search queries for items
- categories
- tags or keywords
- price
- most recently listed

#### Delete

- item
- user
- feedback
