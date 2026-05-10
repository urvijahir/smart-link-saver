const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createLink,
  getLinks,
  deleteLink,
  updateLink,
} = require("../controllers/linkController");

router.post("/", protect, createLink);
router.get("/", protect, getLinks);
router.delete("/:id", protect, deleteLink);
router.put("/:id", protect, updateLink);

module.exports = router;
