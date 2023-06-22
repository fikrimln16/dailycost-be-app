const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const belanjaController = require("../controller/belanja/belanjaController");
router.post("/belanja", belanjaController);

module.exports = router;
