const express = require('express');
const { body } =  require('express-validator/check'); // for validation of data
const User = require('../models/users');
const authController = require('../controllers/auth');

const router = express.Router();

router.post("/signup/otp", authController.otpVerification); //otp verification after signup

router.post("/signup/otp-resend", authController.resendOTP);//resend-otp verification 

router.post('/signup/resetOtp',[
  body('email')
  .isEmail()
  .withMessage('Please Enter a Valid Email') //Stored in error object which can be retrived.
  .custom((value, { req } ) => { //to check whether the email adress already exist or not. 
    return User.findOne({email: value}).then(UserDoc => {
        if(!UserDoc){ // return a promise if validation done a async task
            return Promise.reject('E-mail Does not  Exist');
        }
    })
})/* .normalizeEmail() */, // check for  .. or + - in the email and remove it 
],authController.sendResetOtp)

router.post('/signup/checkOtp',authController.checkOtp)

router.post("/signup/reset-password", [
  body('newPassword').trim().isLength({ min: 5 }),
  body('confirmPassword').trim().isLength({ min: 5 }),
],authController.resetPassword);

router.put('/signup',[  // put because we create a user once so doesn't matter if its new or we overwrite existing data
    body('email')
        .isEmail()
        .withMessage('Please Enter a Valid Email') //Stored in error object which can be retrived.
        .custom((value, { req } ) => { //to check whether the email adress already exist or not. 
            return User.findOne({email: value}).then(UserDoc => {
                if(UserDoc){ // return a promise if validation done a async task
                    return Promise.reject('E-mail Address already Exist');
                    //  res.status(201).json({ message: " E-mail Adress already Exist" });
                     
                }
            })
        })/* .normalizeEmail() */, // check for  .. or + - in the email and remove it 

    body('password')
        .trim()
        .isLength({min:5}),
    body('name')
        .trim()
        .not()
        .isEmpty() 
],authController.signup
);

//router.post('/resend-otp',) //if

router.post('/login',[
    body("email")
      .isEmail()
      .withMessage("Invalid email")
     
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userexist) => {
          if (!userexist) {
            return Promise.reject("user does not exist");
          }
        });
      }),
    body("password").trim().isLength({ min: 5 }),
  ],authController.login);


module.exports = router; //For exporting router to app.js



// at 204 invalid eamil or password
// at 203 please add email or password
// at 423 email doesnt exist
// at 424 now verify your email
// at 205 user already exists
// at 422 confirm your password
// at 401 please add all the fields
// at 400 error is password must contain 5 characters