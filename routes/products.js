const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ProductController = require("../controllers/ProductController");

const { authentication, isAdmin } = require("../middleware/authentication");

router.post(
  "/create",
  authentication,
  isAdmin,
  upload.single("image"),
  ProductController.create
);
router.put("/:_id", authentication, isAdmin, ProductController.update);
router.delete("/:_id", authentication, isAdmin, ProductController.delete);
router.get("/", ProductController.getAll);
router.get("/:_id", ProductController.getById);
router.put("/like/:_id", authentication, ProductController.like);
router.put("/dislike/:_id", authentication, ProductController.dislike);

module.exports = router;
