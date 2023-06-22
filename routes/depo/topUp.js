const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth/verifyToken');

const postTopUpController = require("../../controller/depo/postTopUpController")

router.post('/topup', postTopUpController)

module.exports = router;