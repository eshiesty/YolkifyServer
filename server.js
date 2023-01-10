require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
//import routes
const authRoute = require("./routes/auth");

app.use("/api/auth", authRoute);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");

    app.listen(process.env.PORT, () => {
      console.log(`server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
