const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const getpemasukanById = require("../controller/pemasukan/getPemasukanController")
const postPemasukan = require("../controller/pemasukan/postPemasukanController")

router.get("/pemasukan/:id", verifyToken, getpemasukanById)
router.post("/pemasukan/:id", verifyToken, postPemasukan)

module.exports = router