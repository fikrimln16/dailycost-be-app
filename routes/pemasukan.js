const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

// const deletepemasukanController = require("../controller/pemasukan/deletepemasukanController")
const getpemasukanById = require("../controller/pemasukan/getPemasukanController")
const postPemasukan = require("../controller/pemasukan/postPemasukanController")
// const getpemasukanByDate = require("../controller/pemasukan/getpemasukanByDate")
// const getpemasukanByMonth = require("../controller/pemasukan/getpemasukanByMonth")
// const getpemasukanChart = require("../controller/pemasukan/getpemasukanChart")

// router.delete("/pemasukan", verifyToken, deletepemasukanController)
router.get("/pemasukan/:id", getpemasukanById)
router.post("/pemasukan", postPemasukan)
// router.get("/pemasukan/:id/list/:tanggal",  verifyToken, getpemasukanByDate)
// router.get("/pemasukan/:id/list/:bulan/:tahun",  verifyToken, getpemasukanByMonth)
// router.get("/pemasukan/chart/:id",  verifyToken, getpemasukanChart)

module.exports = router