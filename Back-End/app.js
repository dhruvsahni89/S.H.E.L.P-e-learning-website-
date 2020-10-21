const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // importing mongoose

const signupRoute = require('./routes/signup'); //importing signup route
const errorController = require('./controllers/error');
const feedRoutes = require('./routes/feed');
const createCourse = require('./routes/creator');
const homeRoute = require('./routes/users');
const courseRating = require('./routes/courses')
const app = express();

const port = 8080 //whatever is in the environment variable PORT or 3000


//  app.use('/',errorController.error404);
app.use((error, req, res, next) => {
    const status = error.statusCode||500;
    const data = error.data;
    const message = error.message;
    
    res.status(status).json({
      message: message,
      data: data,
    });
  });


// const fileStoragevideo = multer.diskStorage({ //for multer storage
//     //these are two functions which are called by multer for incoming file
//     destination: (req, file, cb)=> {
//         cb(null,'videos'); // null tells the call backs that its ok to store the file because that place is for error
//     },
//     filename:(req, file, cb)=> {
//         cb(null,new Date().toDateString() + "-" + file.originalname);
//     }
// });
// const fileFiltervideo = (req, file, cb) => {
//     if(file.mimetype === 'video/mp4'){
//         cb(null,true);  //if we want to store that file
//     }
//     else{
//         cb(null,false); //if we dont want to store that file
//         console.log("wrong file type");
//     }
// };

// For parsing the incoming json file from the client
app.use(bodyParser.json()); 

app.use(express.static(path.join(__dirname,'uploads'))); //Serving images and video
app.use(express.static(path.join(__dirname,'videos'))); //Serving the video files
app.use(express.static(path.join(__dirname,'data','invoices'))); //Serving the pdf files

app.use((req, res, next) =>{  // To remove CROS (cross-resource-origin-platform) problem 
    res.setHeader('Access-Control-Allow-Origin',"*"); // to allow all client we use *
    res.setHeader('Access-Control-Allow-Methods',"OPTIONS,GET,POST,PUT,PATCH,DELETE"); //these are the allowed methods 
    res.setHeader('Access-Control-Allow-Headers', "*"); // allowed headers (Auth for extra data related to authoriaztiom)
    next();
})

app.use(signupRoute);  //For signUp route
app.use(createCourse); //For creating a course by creator
app.use(homeRoute);    //
app.use(courseRating); //
app.use(feedRoutes);   // for dummy data 


app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,data:data});
}) 



mongoose.connect('mongodb+srv://Abhishek_Srivas:Pagalworld@cluster0.0sntl.mongodb.net/Database?retryWrites=true&w=majority')
.then(result =>{
    app.listen(port);
    console.log("server started");
})
.catch(err =>{
    console.log(err);
})