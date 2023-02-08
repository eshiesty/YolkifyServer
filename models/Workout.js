const { Schema, model } = require("mongoose");

const WorkoutSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
    },
    startTime: {
      type: String,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
    },
    workout: {
      type: Array,
      required: true,
    },
    finishTime: {
      type: String,
      rquired: true,
    },
  },
  { timestamps: true }
);

const Workout = model("Workout", WorkoutSchema);
module.exports = Workout;
