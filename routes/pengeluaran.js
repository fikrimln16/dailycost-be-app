const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");

const deletePengeluaranController = require("../controller/pengeluaran/deletePengeluaranController")
const getPengeluaranById = require("../controller/pengeluaran/getPengeluaranById")
const getPengeluaranByDate = require("../controller/pengeluaran/getPengeluaranByDate")
const getPengeluaranByMonth = require("../controller/pengeluaran/getPengeluaranByMonth")
const getPengeluaranChart = require("../controller/pengeluaran/getPengeluaranChart")
const postPengeluaran = require("../controller/pengeluaran/postPengeluaranController")

router.delete("/pengeluaran/:id", verifyToken, deletePengeluaranController)
router.get("/pengeluaran/:id", verifyToken, getPengeluaranById)
router.get("/pengeluaran/:id/list/:tanggal", verifyToken, getPengeluaranByDate)
router.get("/pengeluaran/:id/list/:bulan/:tahun", verifyToken, getPengeluaranByMonth)
router.get("/pengeluaran/chart/:id",  verifyToken, getPengeluaranChart)
router.post("/pengeluaran/:id",  verifyToken, postPengeluaran)

module.exports = router