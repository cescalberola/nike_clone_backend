const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");

const ProductController = {
  async create(req, res, next) {
    try {
      const product = await Product.create({
        ...req.body,
        userId: req.user._id,
        image: req.file.filename,
      });
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { productIds: product._id } },
        { new: true }
      );
      res
        .status(201)
        .send({ message: "Product created successfully", product });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async update(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params._id,
        req.body,
        {
          new: true,
        }
      );
      res.send({ message: "Product updated successfully!", product });
    } catch (error) {
      console.error(error);
    }
  },

  async delete(req, res) {
    try {
      await Product.findByIdAndDelete(req.params._id);
      await Review.deleteMany({ productId: req.params._id });
      res.send({ message: "Product deleted succesfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to remove the product" });
    }
  },

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 30 } = req.query;
      const products = await Product.find({})
        .populate({
          path: "userId",
          select: "firstName",
        })
        .populate({
          path: "reviewIds",
          populate: {
            path: "userId",
            select: "firstName",
          },
        })
        .limit(limit)
        .skip((page - 1) * limit);
      res.status(200).send(products);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getById(req, res) {
    try {
      const product = await Product.findById(req.params._id)
        .populate("userId")
        .populate({
          path: "reviewIds",
          populate: {
            path: "userId",
            select: "firstName",
          },
        });
      res.send(product);
    } catch (error) {
      console.error(error);
    }
  },

  // async getByName(req, res) {
  //   try {
  //     if (req.params.name.length > 20) {
  //       return res.status(400).send("Search too long");
  //     }
  //     const title = new RegExp(req.params.name, "i");
  //     const products = await Product.find({ title });
  //     res.send(products);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  async like(req, res) {
    try {
      const loggedUser = await User.findById(req.user._id);
      let productToLike = await Product.findById(req.params._id);

      if (!productToLike)
        return res.status(400).send({ message: "Product not found" });

      if (productToLike.likes.includes(req.user._id)) {
        return res.status(400).send({
          message: `You already liked ${productToLike.userId}, product ${loggedUser.firstName}`,
        });
      } else {
        productToLike = await Product.findByIdAndUpdate(
          req.params._id,
          { $push: { likes: req.user._id } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          req.user._id,
          { $push: { likesList: req.params._id } },
          { new: true }
        );
        res.send(productToLike);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem liking the product" });
    }
  },

  async dislike(req, res) {
    try {
      let productToUnlike = await Product.findById(req.params._id);
      if (!productToUnlike)
        return res.status(400).send({ message: "Product not found" });

      productToUnlike = await Product.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likesList: req.params._id } },
        { new: true }
      );
      res.send({ messasge: "Like removed", productToUnlike });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem unliking the product" });
    }
  },
};

module.exports = ProductController;
