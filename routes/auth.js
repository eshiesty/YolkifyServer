const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permissions");
//@route    GET /api/auth/test
//@desc     Test the auth route
//@access   Public
router.get("/test", (req, res) => {
  res.send("auth route working");
});
//@route    POST /api/auth/register
//@desc     Create a new user
//@access   Public
router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const userExists = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"), //validate email for lower and upper case
    });
    if (userExists) {
      return res.status(400).json({ error: "email already in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    const savedUser = await newUser.save();
    //get rid of the password on the return for security
    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;
    return res.json(userToReturn);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

//@route    POST /api/auth/login
//@desc     Login a user and return access token
//@access   Public
router.post("/login", async (req, res) => {
  try {
    //check for the user
    const user = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "there was a problem with your login credentials" });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: "there was a problem with your login credentials" });
    }

    const payload = { userId: user._id };
    //turns the payload into a web token using jwt secret
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //sets the cookie using that token. names it access token
    //makes it valid for only 7 days. and http server access only.
    //that way, it cannot be accessed in the browser
    //During production, secure will be true
    res.cookie("access-token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const userToReturn = { ...user._doc };
    delete userToReturn.password;
    return res.json({ token: token, user: userToReturn });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
module.exports = router;
