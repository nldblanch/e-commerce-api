const { getEndpoints } = require("../controllers/api.controller");

const api = require("express").Router();

api.get("/", getEndpoints);

module.exports = api;
