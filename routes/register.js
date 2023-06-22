const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register user
 *     description: Mendaftarkan pengguna baru dengan nama, email, dan password
 *     tags:
 *       - LoginRegister
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       '409':
 *         description: Email sudah terdaftar
 *       '500':
 *         description: Terjadi kesalahan saat register
 */

router.post("/", (req, res) => {
	const { name, email, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;

	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(409).json({
				status: "Failed",
				message: "Email sudah terdaftar!",
			});
		} else {
			const token = jwt.sign({ email }, "rahasia");
			db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
				if (err) {
					console.log(err);
					res.status(409).send("Conflict!");
				} else {
					const id = {
						id: results[0].id,
					};
					return res.status(200).json({
						status: "Succes",
						message: `Berhasil register dengan email : ${email}`,
						token,
						data: id,
					});
				}
			});
		}
	});
});

module.exports = router;
