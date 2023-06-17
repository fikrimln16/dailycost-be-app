const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Melakukan login dengan email dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: root
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Succes
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzMsImVtYWlsIjoiYWRtaW4
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nama:
 *                       type: string
 *                       example: admin
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan saat login
 */
router.post("/", (req, res) => {
	const { email, password } = req.body;

	// Ambil user dari database berdasarkan email
	db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ message: "Terjadi kesalahan saat login." });
		}

		if (results.length === 0) {
			return res.status(401).json({ message: "Email atau password salah." });
		}

		// Bandingkan password yang diinputkan dengan password di database
		bcrypt.compare(password, results[0].password, (error, match) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ message: "Terjadi kesalahan saat login." });
			}
			if (!match) {
				return res.status(401).json({ message: "Email atau password salah." });
			}

			const profile = {
				id: results[0].id,
				nama: results[0].name,
			};

			// Buat token JWT
			const token = jwt.sign(
				{ id: results[0].id, email: results[0].email },
				"rahasia",
				{ expiresIn: "1h" }
			);
			return res.status(200).json({
				status: "Succes",
				token,
				data: profile,
			});
		});
	});
});

module.exports = router;
