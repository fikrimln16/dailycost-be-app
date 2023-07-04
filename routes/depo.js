const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const postTopUpController = require("../controller/depo/postTopUpController")
const postDepoController = require("../controller/depo/postDepoController")
const putDepoController = require("../controller/depo/putDepoController")
const getSaldoController = require("../controller/depo/getSaldoController")

router.post('/topup/:id',  verifyToken, postTopUpController)
router.post('/depo',  verifyToken, postDepoController)
router.put('/depo/:id', verifyToken, putDepoController)
router.get("/saldo/:id", verifyToken, getSaldoController)

module.exports = router