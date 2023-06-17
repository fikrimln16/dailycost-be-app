const cors = require("cors");

const corsMiddleware = cors({
  origin: "*",
  methods: ["GET", "POST"], // allow these HTTP methods
});

module.exports = corsMiddleware;
