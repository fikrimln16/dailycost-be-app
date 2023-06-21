const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
	projectId: "astute-acolyte-381310",
	keyFilename: path.join(__dirname, "keyfile.json"),
});

module.exports = storage