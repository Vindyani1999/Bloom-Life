const express = require("express");
const { loginAdmin, createAdmin } = require("../controllers/adminController");
const {
  getCatalog,
  upsertCatalog,
} = require("../controllers/catalogController");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create", createAdmin); // Route to create initial admin
router.get("/catalog", requireAdmin, getCatalog);
router.put("/catalog", requireAdmin, upsertCatalog);

module.exports = router;
