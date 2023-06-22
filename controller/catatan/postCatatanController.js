const storage = require("../../config/storage");
const catatanModel = require("../../models/catatan");

/**
 * @swagger
 * /api/catatan:
 *   post:
 *     summary: Membuat catatan baru
 *     description: Endpoint untuk membuat catatan baru
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Catatan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               user_id:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Catatan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *             example:
 *               status: "Success"
 *               message: "Berhasil memasukkan catatan!"
 *               data:
 *                 user_id : 1
 *                 catatan_id : 1
 *                 url: https://storage.googleapis.com/dailycost-catatan-images/1686970383592-FIKRI.jpeg
 *       400:
 *         description: Gagal membuat catatan karena validasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Mohon unggah file gambar!"
 *       500:
 *         description: Terjadi kesalahan saat membuat catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Terjadi kesalahan."
 */
const postCatatan = (req, res) => {
	const { title, body, date, user_id } = req.body;
	const file = req.file;

	const bucketName = "dailycost-catatan-images";

	if (!file) {
		return res.status(400).json({
			status: "Failed",
			message: "Mohon unggah file gambar!",
		});
	}

	// Buat nama file baru tanpa spasi
	const newFileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "");

	// buat instance bucket
	const myBucket = storage.bucket(bucketName);
	// upload gambar ke bucket
	const blob = myBucket.file(newFileName); // gunakan nama file baru
	const blobStream = blob.createWriteStream({
		metadata: {
			contentType: file.mimetype,
		},
	});

	blobStream.on("error", (err) => {
		console.error(err);
		return res.status(500).json({
			status: "Failed",
			message: "Terjadi kesalahan!",
		});
	});

	let publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
	blobStream.on("finish", () => {
		// set public access untuk file
		blob.makePublic().then(() => {
			// dapatkan public link dari file
			publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru

			// Simpan catatan ke database menggunakan model
			catatanModel.createCatatan(
				title,
				body,
				date,
				user_id,
				publicUrl,
				(error, catatanId, statusCode) => {
					if (error) {
						return res.status(statusCode).json({
							status: "Failed",
							message: "Terjadi kesalahan!",
						});
					}

					return res.status(statusCode).json({
						status: "Success",
						message: "Berhasil memasukkan catatan!",
						data: { user_id: user_id, catatan_id: catatanId, url: publicUrl },
					});
				}
			);
		});
	});

	blobStream.end(file.buffer);
};

module.exports = postCatatan;
