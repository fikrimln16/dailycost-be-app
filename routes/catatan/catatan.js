const express = require("express");
const router = express.Router();
const verifyToken = require("../../auth/verifyToken");
const db = require("../../config/db");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // batasan ukuran file 5MB
	},
});

// inisialisasi client Google Cloud Storage
const storage = new Storage({
	projectId: "astute-acolyte-381310",
	keyFilename: path.join(__dirname, "keyfile.json"),
});

/**
 * @swagger
 * /api/catatan:
 *   get:
 *     summary: Mendapatkan daftar catatan
 *     tags:
 *       - Catatan
 *     description: Endpoint untuk mendapatkan daftar catatan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       user_id:
 *                         type: integer
 *                       image_url:
 *                         type: string
 *             example:
 *               status: "Success"
 *               message: "Berhasil Mengambil Catatan!"
 *               data:
 *                 - id: 1
 *                   title: "Catatan Penting"
 *                   body: "Ini adalah catatan penting"
 *                   date: "2023-06-16"
 *                   user_id: 73
 *                   image_url: "https://storage.googleapis.com/dailycost-catatan-images/1623839930341-gambar.jpg"
 *                 - id: 2
 *                   title: "Catatan Harian"
 *                   body: "Ini adalah catatan harian"
 *                   date: "2023-06-17"
 *                   user_id: 73
 *                   image_url: "https://storage.googleapis.com/dailycost-catatan-images/1623840051892-gambar.jpg"
 *       404:
 *         description: Data catatan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       user_id:
 *                         type: integer
 *                       image_url:
 *                         type: string
 *             example:
 *               status: "Failed"
 *               message: "Data tidak ada!"
 *               data: []
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan daftar catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: "Failed"
 *               message: "Terjadi kesalahan."
 */
router.get("/catatan", verifyToken, (req, res) => {
	db.query("SELECT * FROM catatan", (error, results) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ message: "Terjadi kesalahan." });
		}
		if (results.length === 0) {
			return res.status(404).json({ status: "Data Tidak Ada", data: [] });
		}
		return res.status(200).json({
			status: "Success",
			message: "Berhasil Mengambil Catatan!",
			data: results,
		});
	});
});

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
router.post("/catatan", upload.single("file"), verifyToken, (req, res) => {
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

	var publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
	blobStream.on("finish", () => {
		// set public access untuk file
		blob.makePublic().then(() => {
			// dapatkan public link dari file
			publicUrl = `https://storage.googleapis.com/${bucketName}/${newFileName}`; // gunakan nama file baru
		});
	});
	blobStream.end(file.buffer);

	db.query(
		"INSERT INTO catatan VALUES(null, ?, ?, ?, ?, ?) ",
		[title, body, date, user_id, publicUrl],
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: "Terjadi kesalahan!",
				});
			}

			const catatanId = results.insertId;

			return res.status(200).json({
				status: "Success",
				message: "Berhasil memasukkan catatan!",
				data: { user_id: user_id, catatan_id: catatanId, url: publicUrl },
			});
		}
	);
});

/**
 * @swagger
 * /api/catatan:
 *   delete:
 *     summary: Menghapus catatan
 *     description: Endpoint untuk menghapus catatan user dengan catatan_id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Catatan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               catatan_id:
 *                 type: integer
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
 *               message: "Berhasil menghapus catatan!"
 *       404:
 *         description: Catatan Tidak Ditemukan!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Catatan Tidak Ditemukan!."
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
router.delete("/catatan", verifyToken, (req, res) => {
	const { user_id, catatan_id } = req.body;

	const bucketName = "dailycost-catatan-images";
	const bucket = storage.bucket(bucketName);

	try {
		db.query(
			"SELECT url FROM catatan WHERE user_id = ? AND catatan_id = ?",
			[user_id, catatan_id],
			(error, result) => {
				if (error) {
					return res.status(404).json({
						status: "Failed",
						message: "Tidak ada catatan yang ditemukan",
					});
				} else if (result.length === 0) {
					return res.status(404).json({
						status: "Failed",
						message: "Catatan tidak ditemukan",
					});
				} else {
					const url = result[0].url;
					db.query(
						"DELETE FROM catatan WHERE user_id = ? AND catatan_id = ?",
						[user_id, catatan_id],
						(error, result) => {
							if (error) {
								return res.status(500).json({
									status: "Failed",
									message: "Terjadi kesalahan pada server",
								});
							} else {
								const fileName = url.substring(url.lastIndexOf("/") + 1);
								const file = bucket.file(fileName);

								// Menghapus gambar dari bucket
								file.delete(function (err) {
									if (err) {
										return res.status(500).json({
											status: "Failed",
											message: "Terjadi kesalahan pada server saat menghapus catatan",
										});
									} else {
										return res.status(200).json({
											status: "Success",
											message: "Catatan berhasil dihapus",
										});
									}
								});
							}
						}
					);
				}
			}
		);
	} catch (error) {
		return res.status(500).json({
			status: "Failed",
			message: "Terjadi kesalahan pada server",
		});
	}
});

/**
 * @swagger
 * /api/catatan/{id}:
 *   get:
 *     summary: Mendapatkan catatan berdasarkan ID pengguna
 *     tags:
 *       - Catatan
 *     description: Endpoint untuk mendapatkan catatan berdasarkan ID pengguna
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID pengguna
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       catatan_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date
 *                       created_at_epoch:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       url:
 *                         type: string
 *             example:
 *               status: Succes
 *               message: "Berhasil mengambil catatan dengan user id : 73"
 *               data:
 *                 - catatan_id: 1
 *                   title: "Catatan 1"
 *                   body: "Ini adalah catatan 1"
 *                   created_at: "2023-06-16"
 *                   created_at_epoch: 1682614800
 *                   user_id: 73
 *                   url: "https://storage.googleapis.com/dailycost-catatan-images/catatan1.jpg"
 *                 - catatan_id: 2
 *                   title: "Catatan 2"
 *                   body: "Ini adalah catatan 2"
 *                   created_at: "2023-06-15"
 *                   created_at_epoch: 1682614800
 *                   user_id: 73
 *                   url: "https://storage.googleapis.com/dailycost-catatan-images/catatan2.jpg"
 *       500:
 *         description: Terjadi kesalahan saat mendapatkan catatan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               status: Failed
 *               message: "Terjadi kesalahan pada server."
 */
router.get("/catatan/:id", verifyToken, (req, res) => {
	const id = req.params.id;

	db.query(
		'SELECT catatan_id, title, body, DATE_FORMAT(created_at, "%d %M %Y") AS created_at, UNIX_TIMESTAMP(created_at) AS created_at_epoch, user_id, url FROM catatan WHERE user_id = ? ORDER BY catatan_id DESC',
		[id],
		(error, results) => {
			if (error) {
				console.error(error);
				return res.status(500).json({
					status: "Failed",
					message: "Terjadi kesalahan pada server",
				});
			}
			//   if (results.length === 0) {
			//     return res.status(404).json({
			//       status: "Failed",
			//       message: "Data Tidak Ada",
			//       data: results
			//     });
			//   }
			return res.status(200).json({
				status: "Succes",
				message: `Berhasil mengambil catatan dengan user id : ${id}`,
				data: results,
			});
		}
	);
});

// /**
//  * @swagger
//  * /api/upload/image:
//  *   post:
//  *     summary: Mengunggah gambar
//  *     description: Endpoint untuk mengunggah gambar
//  *     tags:
//  *       - Catatan
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Gambar berhasil diunggah
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 publicUrl:
//  *                   type: string
//  *             example:
//  *               publicUrl: "https://storage.googleapis.com/dailycost-catatan-images/gambar.jpg"
//  *       400:
//  *         description: Gagal mengunggah gambar karena validasi
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *             example:
//  *               status: Failed
//  *               message: "Mohon unggah file gambar!"
//  *       500:
//  *         description: Terjadi kesalahan saat mengunggah gambar
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *             example:
//  *               status: Failed
//  *               message: "Terjadi kesalahan pada server saat mengunggah gambar."
//  */

// // tentukan nama bucket
// router.post("/upload/image", upload.single("image"), (req, res, next) => {
// 	const bucketName = "dailycost-catatan-images";
// 	const file = req.file;

// 	if (!file) {
// 		res.status(400).send("Mohon unggah file gambar!");
// 		return;
// 	}

// 	// buat instance bucket
// 	const myBucket = storage.bucket(bucketName);

// 	// upload gambar ke bucket
// 	const blob = myBucket.file(file.originalname);
// 	const blobStream = blob.createWriteStream({
// 		metadata: {
// 			contentType: file.mimetype,
// 		},
// 	});

// 	blobStream.on("error", (err) => {
// 		console.error(err);
// 		res.status(500).send("Terjadi kesalahan saat mengunggah gambar.");
// 	});

// 	blobStream.on("finish", () => {
// 		// set public access untuk file
// 		blob.makePublic().then(() => {
// 			// dapatkan public link dari file
// 			const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;
// 			res.status(200).send({ publicUrl });
// 		});
// 	});

// 	blobStream.end(file.buffer);
// });

module.exports = router;
