const express = require("express");
const authRouter = express.Router();
const UserModel = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.get("/sign-up", (req, res) => {
  return res.render("auth/sign-up.ejs");
});

authRouter.post("/sign-up", async (req, res) => {
  try {

      // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken.')
    }

    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }

    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    // All ready to create the new user!
    await User.create(req.body)

    res.redirect('/auth/sign-in')
  } catch (error) {
    console.log(error.message)
  }
});

authRouter.get("/sign-in", (req, res) => {
  return res.render("auth/sign-in.ejs");
});

authRouter.post("/sign-in", async (req, res) => {
  const userFromDatabase = await UserModel.findOne({
    username: req.body.username,
  });

  const passwordsMatch = await bcrypt.compare(
    req.body.password,
    userFromDatabase.password
  );

  req.session.user = { username: userFromDatabase.username };

  if (passwordsMatch) {
    res.redirect("/");
  } else {
    return res.send(`Login Failed`);
  }
});

module.exports = authRouter;

