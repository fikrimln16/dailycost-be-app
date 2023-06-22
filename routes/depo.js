const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const postTopUpController = require("../controller/depo/postTopUpController")
const postDepoController = require("../controller/depo/postDepoController")
const putDepoController = require("../controller/depo/putDepoController")
const getSaldoController = require("../controller/depo/getSaldoController")

router.post('/topup',  postTopUpController)
router.post('/depo',  postDepoController)
router.put('/depo', putDepoController)
router.get("/saldo/:id", getSaldoController)

module.exports = router