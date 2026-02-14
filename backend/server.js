require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const healthRoutes = require("./routes/healthRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    // origin: process.env.FRONTEND_URL || "http://localhost:5173",
    origin: "*",
  }),
);

app.get("/", (_req, res) => res.send("Bloom Life backend running"));

app.use("/api/health", healthRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
