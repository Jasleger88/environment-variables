const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");




authrouter.get("/sign-up", async (req, res) => {
   return res.render("auth/sign-up.ejs");

    autoRouter.post("/sign-up", (req, res) => {
        const hash =bcrypt.hashSync(req.boy.password, 10);
        req.body.password =hash
    
        router.post("/sign-in", async (req, res) => {
            res.send("Request to sign in received!");

                try {
                    const newUser = await UserModel.create(req.body);
                    res.redirect("/");
                  } catch (error) {
                    if (error.errmsg.includes("duplicate key error")) {
                      res.send(`Username not available <a href="/auth/sign-up">Try again</a>`);
                    }
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



module.exports = authRouter

