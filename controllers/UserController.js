const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;
const transporter = require("../config/nodemailer");
const fs = require("fs").promises;

const UserController = {
  async create(req, res, next) {
    try {
      let hash = "";
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      let avatar = null;
      if (req.file) { avatar = req.file.filename; }

      const user = await User.create({
        ...req.body,
        password: hash,
        avatar: avatar,
        confirmed: false,
        // role: "user",
      });
      const emailToken = jwt.sign({ email: req.body.email }, jwt_secret, {
        expiresIn: "48h",
      });
      const url = "http://localhost:8080/users/confirm/" + emailToken;
      await transporter.sendMail({
        to: req.body.email,
        subject: "Please, confirm your email.",
        html: `<body style="max-width: 1280px; margin: 0 auto; padding: 2rem; text-align: center; color: rgba(255, 255, 255, 0.87); background-color: #242424;">
    <div>
        <h1 style="font-size: 3.2em; line-height: 1.1; color: #646cff;">Hi there, welcome!!</h1>
        <p style="color: rgba(255, 255, 255, 0.87);">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta consequuntur necessitatibus obcaecati, eius fuga nostrum enim illum, esse maxime rem vero dignissimos natus atque quod iure, doloribus illo sequi commodi.</p>
        <p style="color: #535bf2;">Please click <a href="${url}" style="color: #535bf2;">here</a> to confirm.</p>
        <p style="color: rgba(255, 255, 255, 0.87);">If you didn't register with us, ignore this email. The link will lose effect after 48 hours, and the data will be deleted from our servers.</p>
    </div>
</body>`,
      });
      // const token = jwt.sign({ _id: user._id }, jwt_secret);
      // user.tokens.push(token);
      // await user.save();
      // res.status(201).send({ msg: "User created successfully.", loggedUser: user, token });
      res.status(201).send({ msg: "User created successfully.", user });
    } catch (error) {
      next(error);
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, jwt_secret);
      const user = await User.findOneAndUpdate(
        { email: payload.email },
        { confirmed: true },
        { new: true },
      );
      if (!user) { return res.status(400).send({ error: 'Invalid or expired confirmation' }) }
      res.status(201).send("User confirmed successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error confirming email");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ error: "Please enter both email and password." });
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ message: "Incorrect user or password" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect user or password" });
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res.status(200).send({ msg: `Welcome ${user.username}`, token, user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(`Error while trying to connect the current user`, error);
    }
  },

  async updateProfile(req, res) {
    try {
      if (!req.user._id) {
        return res.status(400).send({ msg: "Register user first" });
      }

      let foundUser = await User.findById(req.user._id);

      if (!foundUser) {
        return res.status(400).send({ msg: "User not found" });
      }
      let updateFields = {};

      if (req.file) {
        if (foundUser.avatar) {
          await fs.unlink(`uploads/${foundUser.avatar}`);
        }
        updateFields.avatar = req.file.filename;
      }
      if (req.body.password) {
        updateFields.password = bcrypt.hashSync(req.body.password, 10);
      }

      foundUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
        new: true,
      });

      res.status(200).send({ msg: "User updated", foundUser });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getLoggedUser(req, res) {
    try {
      const user = await User.findById({ _id: req.user._id }).populate('postIds')
      const numOfFollowing = user.following.length;
      const numOfFollowers = user.followers.length;
      const numOfPosts = user.postIds.length;
      const loggedUserInfo = {
        user,
        numOfFollowers,
        numOfFollowing,
        numOfPosts,
      };
      res.status(200).send(loggedUserInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Error while trying to get the current user`, error);
    }
  },

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res
        .status(200)
        .send({ msg: `Disconnected, see you soon ${req.user.username}!` });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        msg: `Error while trying to disconnect the current user`,
        error,
      });
    }
  },

  async follow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToFollow = await User.findById({ _id: req.params._id });
      if (loggedUser.following.includes(userToFollow._id)) {
        res
          .status(400)
          .send({ msg: `Already following ${userToFollow.username}` });
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.params._id } },
          { new: true }
        );
        userToFollow = await User.findByIdAndUpdate(
          req.params._id,
          { $push: { followers: req.user._id } },
          { new: true }
        );
        res.status(200).send({
          msg: `${loggedUser.username} is now following ${userToFollow.username}`,
          loggedUser,
          userToFollow,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async unFollow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToUnfollow = await User.findById({ _id: req.params._id });
      if (!loggedUser.following.includes(userToUnfollow._id)) {
        res
          .status(400)
          .send({ msg: `You're not following ${userToUnfollow.username}` });
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.params._id } },
          { new: true }
        );
        userToUnfollow = await User.findByIdAndUpdate(
          req.params._id,
          { $pull: { followers: req.user._id } },
          { new: true }
        );
        res.status(200).send({
          msg: `${loggedUser.username} is now following ${userToUnfollow.username}`,
          loggedUser,
          userToUnfollow,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const foundUser = await User.findById({ _id: req.params._id });
      if (!foundUser) {
        return res.status(400).send({ msg: `ID: ${req.params._id} not found` });
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getByName(req, res, next) {
    try {
      const username = new RegExp(req.params.username, "i");
      const foundUser = await User.find({ username });
      if (!foundUser) {
        return res
          .status(400)
          .send({ msg: `${req.params.username} not found` });
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = UserController;
