const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const corsMiddleware = require("./config/cors");
app.use(express.json());

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "REST API Docs",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		"./routes/*.js",
		"./routes/depo/*.js",
		"./routes/pengeluaran/*.js",
		"./routes/saldo/*.js",
		"./routes/user/*.js",
		"./controller/catatan/*.js",
		"./controller/belanja/*.js",
		"./controller/depo/*.js"
	], // Ganti dengan jalur yang sesuai dengan file rute Anda
};

const swaggerSpec = swaggerJsdoc(options);

const login = require("./routes/login");
const register = require("./routes/register");
const newDepo = require("./routes/depo/newDepo");
const topup = require("./routes/depo/topUp");
const edit_depo = require("./routes/depo/editDepo");
const userRoutes = require("./routes/user/userRoutes");
const belanja = require("./routes/belanja");
const pengeluaran = require("./routes/pengeluaran/pengeluaran");
const saldo = require("./routes/saldo/saldo");

const catatan = require("./routes/catatan");

// Cors middleware
app.use(corsMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});
// Endpoint login
app.use("/login", login);
// Endpoint register
app.use("/register", register);

app.use("/api", newDepo);
app.use("/api", userRoutes);
app.use("/api", belanja);
app.use("/api", pengeluaran);
app.use("/api", saldo);
app.use("/api", catatan);
app.use("/api", topup);
app.use("/api", edit_depo);

// Jalankan server
app.listen(5000, () => {
	console.log("Server berjalan pada http://localhost:5000");
});
