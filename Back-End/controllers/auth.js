const { validationResult, Result } = require("express-validator/check");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Emailsender=require("../utils/email");
const OtpUser = require("../models/otp");
const nodemailer = require("nodemailer");
const sendgridTRansport = require("nodemailer-sendgrid-transport");
const config = require("../config");
const { json } = require("body-parser");
const transporter = nodemailer.createTransport(
  sendgridTRansport({
    auth: {
      api_key: config.api_key,
    },
  })
);

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
  
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt.hash(password, 12).then((hashedPass) => {
    console.log("password hashed");
    const user = new User({
        isverified: "false",
        email: email,
        name: name,
        password: hashedPass,
    });
  user.save();

      
    let otp = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign(
      {
        email: email,
      },
      "otptoken",
      { expiresIn: 600 } //600s = 10min
    );


    const otpdata = new OtpUser({
        token: token,
        Otp: otp,
        email: email,
    });

    otpdata.save();

    res.status(201).json({ message: "OTP sent to your Email" , token:token});
    // return transporter.sendMail({
    //     to: email,
    //     from: "dhruvsahni.akg@gmail.com",
    //     subject: "signup successful",
    //     html: `<h1>thankuh for registering here is your one time pass : ${otp}</h1>`,
    //   });
    return Emailsender.sendemail(email,otp);

    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.login=(req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      data:errors.array(),
      message:"Invalid credentials"
    })
  }
    const email=req.body.email;
    const password=req.body.password;
   

    User.findOne({email:email}) //checking email exist or not 
    .then( user=>{
      
        if(!user){
          const error = new Error("Login Failed user not found");
          error.statusCode = 422;
          error.data = {
            value: email,
            message: "User not found ",
            param: "email",
            location: "login",
          };
          throw error;
        }
       const isverified=user.isverified;
       console.log(isverified);
       if(isverified ==="false"){
      
        let otp = Math.floor(100000 + Math.random() * 900000);
        
        OtpUser.findOne({ email: email })
        .then((data) =>{
           data.Otp=otp;
           data.save();
        });
        //  transporter.sendMail({
        //   to: email,
        //   from: "dhruvsahni.akg@gmail.com",
        //   subject: "Verify Otp",
        //   html: `<h1>sorry uh have not registered please enter otp before login your one time pass : ${otp}</h1>`,
        // });
        Emailsender.sendemail(email,otp);
        res.status(422).json({
          message: " you have not verified your otp  , new otp has been sent to your email THANK YOU!"
        });
        const error = new Error("Login failed, user not verified");
        error.statusCode = 403;
        error.data = {
          message: "otp sent please verify yourself",
          location: "login",
          id: otp._id,
        };
        throw error;
       
       }
      
      
    bcrypt.compare(password, user.password) // to compare the stored and entered password, returning because this will give us a promise
    .then(equal=>{  //will get a true or false
        if(!equal){
            const error = new Error('wrong password');
            res.status(401).json({ message: "wrong password" });
            error.statusCode=401;
            throw error;
        }
       
        
        const token=jwt.sign({email:user.email , //sign creates new signature and packs it in a new json web token
             userId:user._id.toString()}, // to string because its a mongodb object id here
             'otpverifiedtoken', // passing second argument i.e our private key
             {expiresIn:'6h'}
             );
        
             res.status(200).json({token:token , userId:user._id.toString() , message:'User logged in', username:user.name})
             
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      })
    }


exports.otpVerification = (req, res, next) => {
  const recievedToken = req.body.token;
  const recievedOtp = req.body.Otp;

  console.log()
 
  // searching for otp in database by token that i stored by token1
  OtpUser.findOne({ token: recievedToken })
    .then((data) => {
      console.log("found token");
      // if not found
      if (!data) {
        const error = new Error("Validation failed ,this otp does not exist"); // when token not found
        error.statusCode = 403;
        error.data = {
          value: recievedOtp,
          message: "Invalid token",
          param: "otp",
          location: "otpVerification",
        };
        throw error;
      }

      // check if entered otp is valid
      if (data.Otp === recievedOtp){

        User.findOne({ email: data.email }).then(user => {
          user.isverified = "true";
          console.log(user);
          user.save();
          const token = jwt.sign(
            {
              email: user.email,userId:user._id.toString()
            },
            "otpverifiedtoken",
            { expiresIn:'6h' } 
          );
          data.remove();

          return res.status(200).json({
            message: "otp entered is correct, user added", token:token, userId:user._id.toString(),username:user.name
          });
        });
      } else {

        const error = new Error("Validation Failed");
        error.statusCode = 401;
        res.status(401).json({ message: "wrong otp entered " });
        error.data = {
          value: recievedOtp,
          message: "Otp incorrect",
          param: "otp",
          location: "otp",
        };
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.resendOTP = (req, res, next) =>{ // extra measure's taken if, password valnerability occurs.........

  const token = req.body.token;
  const email = req.body.email;
  
      let otp = Math.floor(100000 + Math.random() * 900000);

      OtpUser.findOne({ email: email })
      .then((data) =>{
        data.Otp = otp ;
        data.save();

      res.status(201).json({ message: "otp stored in database " , token:token});

      // return transporter.sendMail({
      //   to: email,
      //   from: "dhruvsahni.akg@gmail.com",
      //   subject: "Otp resend",
      //   html: `<h1>Your New OTP is : ${otp}</h1>`,
      // });
     return Emailsender.sendemail(email,otp);


    }).catch(err => {
      res.json("error while resending otp");
    })  
}


exports.sendResetOtp= (req, res, next) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    const error = new Error('Email not registered');
    error.statusCode = 422;
    error.data = {
      message:"Email not registered"
    }
    throw error;
  }

  
    const email = req.body.email;
   console.log(email);
   let otp = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign(
      {
        email: email,
      },
      "otptoken",
      { expiresIn: 600 } //600s = 10min
    );


    const otpdata = new OtpUser({
        token: token,
        Otp: otp,
        email: email,
    });
    otpdata.save().then(result => {
      res.json({message:"OTP Saved",result:result})
    }).catch(err => {
      res.json({message:"Otp not saved ",error:err})
    })
   
  //  return transporter.sendMail({
  //   to: email,
  //   from: "dhruvsahni.akg@gmail.com",
  //   subject: "Reset Password Otp",
  //   html: `<h1>Reset OTP : ${otp}</h1>`,
  // });
  return Emailsender.sendemail(email,otp);



}

exports.checkOtp= (req, res, next) => {
  const otp = req.body.otp;
  const checkToken = req.body.token;
  console.log(otp);
  console.log(checkToken)
  OtpUser.findOne({token:checkToken}).then(data => {

    if(!(data.Otp === otp)){
      res.status(400).json("Otp incorrect")
    }
    else{
      res.status(200).json("Otp correct")
    }

  })
}

exports.resetPassword=(req,res,next)=>{
  
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (newPassword != confirmPassword) {
    const error = new Error("reset failed,fields do no match");
    error.statusCode = 422;
    error.data = {
      message: "Confirm password and new password do not match",
      param: "confirmPassword",
    };
    throw error;
  }

   bcrypt.hash(newPassword, 12).then((hashedPass) => {

     User.findOne({email:email}).then(user => {
       
       user.password = hashedPass;

       user.save().then(result => {
         res.json({messsage:"new password saved",updatedUser:result})
       }).catch(err => {
         res.json(err);
       });
     }
     ).catch(err => {
       res.json({error:err,message:"password not saved"});
     });

    
         
   });
 }


  //  let loadedUser;
  //  User.findOne({email:email}) //checking email exist or not 
  //    .then( user=>{
       
  //        if(!user){
  //          const error = new Error("Login Failed user not found");
  //          error.statusCode = 422;
  //          error.data = {
  //            value: email,
  //            message: "User not found ",
  //            param: "email",
  //            location: "login",
  //          };
  //          throw error;
  //        }
  //        loadedUser = user;
  //        return bcrypt.compare(oldPassword,user.password);
  //      })
 
  //      .then((match) => {
  //        // if old password does not match with the one entered by him during signup
  //        if (!match) {
  //          const error = new Error("Password reset failed");
  //          error.statusCode = 401;
  //          error.data = {
  //            message: "password incorrect",
  //            param: "oldPassword",
  //            location: "password reset",
  //          };
  //          throw error;
  //        }
   
  //        //hashing the new password
  //        return bcrypt.hash(newPassword, 12);
  //      })
 
  //      .then(hashedpassword => {
  //        loadedUser.password = hashedpassword;
  //        return loadedUser.save();
  //      })
 
  //      .then((user) => {
  //        return res.status(200).json({
  //          message: "password has been updated",
  //        });
  //      })
  //      .catch((err) => {
  //        if (!err.statusCode) {
  //          err.statusCode = 500;
  //        }
  //        next(err);
  //      });
