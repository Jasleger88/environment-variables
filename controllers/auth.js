const express = require("express");
const router = express.Router();
const User = require("../models/user.js");


module.exports = router;

router.get("/sign-up", async (req, res) => {
    res.render("sign-up.ejs");

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

});

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");

    router.post("/sign-in", async (req, res) => {
        res.send("Request to sign in received!");

        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send("Login failed. Please try again.");
        }
        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
          );
          if (!validPassword) {
            return res.send("Login failed. Please try again.");
          }
          
    });

    router.get("/sign-out", (req, res) => {
        req.session.destroy();
        res.redirect("/");
      });
      

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);

});


