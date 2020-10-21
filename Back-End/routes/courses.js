const express = require('express');
const isAuth=require('../middleware/is-auth');
const courseController = require('../controllers/courses')
const router = express.Router();
const multer = require('multer');



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

const imageMulter = multer({storage:imageStorage,fileFilter:imageFilter}).single('imageurl');

router.put('/Rating',courseController.rating) // For Rating Count 
router.put('/home/courseUpdate',imageMulter,courseController.update) //for updating courses
router.put('/home/edit',isAuth,courseController.edit)  // for editing , showing old data
router.post('/Course/delete',isAuth,courseController.deleteCourse) // for deleting Course
router.post('/searching',courseController.searchCourse)
router.post('/watchedByuser',courseController.watchedVideo)

module.exports = router;