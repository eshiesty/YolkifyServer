const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const bcrypt = require("bcryptjs");
// const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permissions");
const { response } = require("express");

//@route    GET /api/savedworkouts/test
//@desc     Test the savedworkouts route
//@access   Public
router.get("/test", (req, res) => {
  res.send("savedworkouts route working");
});
//@route    GET /api/savedworkouts/save
//@desc     save a workout to the db
//@access   Public
router.post("/save", async (req, res) => {
  try {
    const saved = new Workout({
      user: req.body.user,
      active: false,
      startTime: req.body.startTime,
      workoutName: req.body.workoutName,
      workout: req.body.workout,
      finishTime: req.body.finishTime,
    });

    await saved.save();
    return res.json(saved);
  } catch (err) {
    console.log(err);
    return response.status(500).send(err.message);
  }
});

//@route    GET /api/savedworkouts/test
//@desc     Sync the data to the database
//@access   Public

module.exports = router;
