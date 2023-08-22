const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const getpemasukanById = require("../controller/pemasukan/getPemasukanController")
const postPemasukan = require("../controller/pemasukan/postPemasukanController")
const deletePemasukan = require("../controller/pemasukan/deletePemasukanController")

router.get("/pemasukan/:id", verifyToken, getpemasukanById)
router.post("/pemasukan/:id", verifyToken, postPemasukan)
router.delete("/pemasukan/:id", verifyToken, deletePemasukan)

module.exports = router