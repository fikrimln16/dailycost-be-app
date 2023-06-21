const multer = require("multer");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // batasan ukuran file 5MB
	},
});


module.exports = upload