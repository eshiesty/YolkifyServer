const User = require("../models/User");
const jwt = require("jsonwebtoken");

const requiresAuth = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let isAuthed = false;

  if (token) {
    try {
      //this will verify that the user id

      //get deconstruct the userId from the token. The token is decrypted using the jwt secreet
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      try {
        //see if theres a user that goes with that ID
        const user = await User.findById(userId);
        if (user) {
          //if there is a user, return that user without its password
          const userToReturn = { ...user._doc };
          delete userToReturn.password;
          req.user = userToReturn;
          isAuthed = true;
          //since there is a user, it is authed
        }
      } catch {
        isAuthed = false;
      }
    } catch {
      isAuthed = false;
    }
  }
  if (isAuthed) {
    return next();
  } else {
    //if not able to authorize using the token
    return res.status(401).send("Unauthorized");
  }
};

module.exports = requiresAuth;
