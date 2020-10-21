const express = require('express');
const { body } =  require('express-validator/check'); // for validation of data
const Courses = require('../models/courses');
const courseController = require('../controllers/courses');
const isAuth=require('../middleware/is-auth');
const multer = require('multer');
const router = express.Router();

const imageStorage = multer.diskStorage({ //for multer storage
    //these are two functions which are called by multer for incoming file
    destination: (req, file, cb)=> {
        cb(null,'uploads'); // null tells the call backs that its ok to store the file because that place is for error
    },
    filename:(req, file, cb)=> {
        cb(null,new Date().toDateString() + "-" + file.originalname);
    }
});

const imageFilter = (req, file, cb) => { //For filtering the type of file
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true);  //if we want to store that file
    }
    else{
        cb(null,false); //if we dont want to store that file
        console.log("wrong file type");
    }
};


const videoStorage = multer.diskStorage({ //for multer storage
    //these are two functions which are called by multer for incoming file
    destination: (req, file, cb)=> {
        cb(null,'videos'); // null tells the call backs that its ok to store the file because that place is for error
    },
    filename:(req, file, cb)=> {
        cb(null,new Date().toDateString() + "-" + file.originalname);
    }
});

const videoFilter = (req, file, cb) => { //For filtering the type of file
    if(file.mimetype === 'video/mp4'){
        cb(null,true);  //if we want to store that file
    }
    else{
        cb(null,false); //if we dont want to store that file
        console.log("wrong file type");
    }
};

//Multer for handeling incoming Files
const imageMulter = multer({storage:imageStorage,fileFilter:imageFilter}).single('image');
const videoMulter = multer({storage:videoStorage,fileFilter:videoFilter}).any();

router.post('/creator/create-course',[
    body('title').trim().isLength({min:5}),
    body('name').trim().isLength({min:5}) 
],imageMulter,courseController.createcourse);

router.post('/creator/videoUpload/:videocourseID',videoMulter,courseController.videoUpload)


module.exports = router;