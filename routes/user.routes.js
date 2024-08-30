var express = require('express');
var router = express.Router();

const UserSchema = require('../models/userSchema')
const {isLoggedIn} = require('../middleware/auth.middleware')

const passport = require('passport')
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(UserSchema.authenticate()));
 
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome To User Routes');
});


router.get("/signup", async (req, res) => {
  res.render("signupuser", {
      title: "Expense Tracker | Signup",
      user: req.user,
  });
});
router.post("/signup", async (req, res) => {
  try {
      const { username, email, password } = req.body;
      await UserSchema.register({ username, email }, password);
      // await UserSchema.authenticate(username, password);
      // res.redirect("/user/profile");
      res.redirect("/user/signin");
  } catch (error) {
      console.log(error.message);
  }
});
router.get("/signin", async (req, res) => {
  res.render("signinuser", {user: req.user});
});
router.post("/signin",
  passport.authenticate("local", {
      successRedirect: "/user/profile",
      failureRedirect: "/user/signin",
  }),
  (req, res) => {}
);

router.get("/profile", isLoggedIn, async (req, res) => {
  try {
      res.render("profileuser", {
          title: "Expense Tracker | Profile",
          user: req.user,
      });
  } catch (error) {
      console.log(error.message);
  }
});

router.get("/signout", isLoggedIn, async (req, res) => {
  req.logout(() => {
      res.redirect("/user/signin");
  });
});

module.exports = router;
