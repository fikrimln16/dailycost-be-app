const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/verifyToken");
const upload = require("../config/multer")

const getCatatanController = require("../controller/catatan/getCatatanController");
const postCatatanController = require("../controller/catatan/postCatatanController");
const putCatatanController = require("../controller/catatan/putCatatanController");
const deleteCatatanController = require("../controller/catatan/deleteCatatanController");
const getCatatanByIdController = require("../controller/catatan/getCatatanByIdController");


router.get("/catatan", verifyToken, getCatatanController);
router.post("/catatan",upload.single("file"), verifyToken, postCatatanController);
router.put("/catatan", verifyToken, putCatatanController);
router.delete("/catatan", verifyToken,deleteCatatanController);
router.get("/catatan/:id", verifyToken, getCatatanByIdController);


module.exports = router;
