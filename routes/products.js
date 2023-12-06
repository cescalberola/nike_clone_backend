const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const {
  authentication,
  isAdmin,
  isSuperAdmin,
  isProductAuthor,
} = require("../middleware/authentication");
// const upload = require("../middleware/upload");

router.post("/create",
  authentication,
  // upload.single("image"),
  ProductController.create);
// router.put("/:_id", authentication, isProductAuthor, ProductController.update);
// router.delete("/:_id", authentication, isProductAuthor, ProductController.delete);
// router.get("/", ProuctController.getAll);
// router.get("/:_id", ProuctController.getById);
// router.get("/name/:name", ProuctController.getByName);
// router.put("/like/:_id", authentication, ProuctController.like);
// router.put("/unlike/:_id", authentication, ProuctController.unlike);

module.exports = router;
