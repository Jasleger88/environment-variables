const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.get("/sign-up", (req, res) => {
  return res.render("auth/sign-up.ejs");
});

authRouter.post("/sign-up", async (req, res) => {
  console.log("does this work")
  try {
    // Check if the username is already taken
    const userInDatabase = await UserModel.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }

    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create the new user
    await UserModel.create(req.body);

    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error.message);
  }
});

authRouter.get("/sign-in", (req, res) => {
  return res.render("auth/sign-in.ejs");
});

authRouter.post("/sign-in", async (req, res) => {
  try {
    const userFromDatabase = await UserModel.findOne({ username: req.body.username });

    if (!userFromDatabase) {
      return res.send('User not found');
    }

    const passwordsMatch = await bcrypt.compare(req.body.password, userFromDatabase.password);

    if (passwordsMatch) {
      req.session.user = { username: userFromDatabase.username, userId: userFromDatabase._id };
      res.redirect("/");
    } else {
      return res.send(`Login Failed`);
    }
  } catch (error) {
    res.render("error.ejs", { message: error.message });
  }
});

module.exports = authRouter;
