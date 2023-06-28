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
		"./routes/user/*.js",
		"./controller/catatan/*.js",
		"./controller/depo/*.js",
		"./controller/pengeluaran/*.js",
		"./controller/pemasukan/*.js"
	], // Ganti dengan jalur yang sesuai dengan file rute Anda
};

const swaggerSpec = swaggerJsdoc(options);

const login = require("./routes/login");
const register = require("./routes/register");
const userRoutes = require("./routes/user/userRoutes");
const pengeluaran = require("./routes/pengeluaran");
const catatan = require("./routes/catatan");
const depo = require("./routes/depo")
const pemasukan = require("./routes/pemasukan")

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

app.use("/api", userRoutes);
app.use("/api", pengeluaran);
app.use("/api", catatan);
app.use("/api", depo);
app.use("/api", pemasukan);

// Jalankan server
app.listen(5000, () => {
	console.log("Server berjalan pada http://localhost:5000");
});
