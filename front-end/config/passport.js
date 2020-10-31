const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const User = require("../../api/model/users");
function initialize(passport) {
  passport.use(
    new localStrategy({usernameField: "email"},
    (email, password, done) => {
      User.find({email: email})
        .exec()
        .then( async (user) => {
          if (user.length === 0) {
            return done(null, false, {message: "Email not Registered"});
          }
          try {
            if(await bcrypt.compare(password, user[0].password)){
              return done(null, user);
            }else{
              return done(null, false, {message:'Incorrect Password'});
            }
          } catch (err) {
            return done(err);
          }
        });
    }
  ));

  passport.serializeUser((user, done) => {
   return done(null, user[0]._id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      return done(err, user);
    });
  });
  
}

module.exports = initialize;

// const passport = require("passport");
// const User = require("../../api/model/users");
// const localStrategy = require("passport-local");
// const mongoose = require("mongoose");

// const {check, validationResult} = require("express-validator");

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// passport.use(
//   "local.signup",
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passReqToCallback: true,
//     },
//     (req, email, password, done) => {
//       check("email", "Email is  Invalid").not().isEmail();
//       check("password", "Password is Invalid")
//         .not()
//         .isEmpty()
//         .isLength({min: 8});
//       let errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         let messages = [];
//         errors.array().forEach(err => messages.push(err.msg));
//         return done(null, false, req.flash("error", messages));
//       }
//       User.findOne({'email': email}, (err, user) => {
//         if (err) {
//           return done(err);
//         }
//         if (user) {
//           return done(null, false, {message: "Email is already in use."});
//         }
//         let newUser = new User();
//         newUser.email = email;
//         newUser.password = newUser.encryptPassword(password);
//         newUser._id = mongoose.Types.ObjectId();
//         newUser.save((err, result) => {
//           if (err) {
//             return done(err);
//           } else {
//             return done(null, newUser);
//           }
//         });
//       });
//     }
//   )
// );

// passport.use(
//   "local.signin",
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       passwordField: true,
//     },
//     (req, email, password, done) => {
//       User.findOne({email: email}, (err, user) => {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, {message: "No user found"});
//         }
//         if(!user.validatePassword(password)){
//             return done(null, false, {message: "Incorrect password"});
//         }
//         return done(null, user);
//       });
//     }
//   )
// );
