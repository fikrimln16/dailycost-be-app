const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const deletePengeluaranController = require("../controller/pengeluaran/deletePengeluaranController")
const getPengeluaranById = require("../controller/pengeluaran/getPengeluaranById")
const getPengeluaranByDate = require("../controller/pengeluaran/getPengeluaranByDate")
const getPengeluaranByMonth = require("../controller/pengeluaran/getPengeluaranByMonth")
const getPengeluaranChart = require("../controller/pengeluaran/getPengeluaranChart")

router.delete("/pengeluaran",  deletePengeluaranController)
router.get("/pengeluaran/:id", getPengeluaranById)
router.get("/pengeluaran/:id/list/:tanggal",  getPengeluaranByDate)
router.get("/pengeluaran/:id/list/:bulan/:tahun",  getPengeluaranByMonth)
router.get("/pengeluaran/chart/:id",  getPengeluaranChart)

module.exports = router