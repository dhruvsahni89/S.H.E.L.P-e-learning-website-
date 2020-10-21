const express = require('express');
const { body } =  require('express-validator/check'); // for validation of data
const UserController = require('../controllers/users');
const courseController = require('../controllers/courses')
const isAuth=require('../middleware/is-auth');
const router = express.Router();

router.get('/home/:category',UserController.homepage);

router.get('/course/:course/:courseID',isAuth,courseController.showCourse);

router.get('/users/:userName/:userId',isAuth,UserController.userPage);

router.post('/home/:category/:courseTitle',isAuth,courseController.bookmarkCourse);

router.post('/unbookmark',courseController.unbookmarkCourse);

router.get('/home/download/:userId',UserController.getinvoice );

router.post('/home/interests',isAuth,UserController.suggestion);

router.post('/home/preferences',isAuth,UserController.preference);

router.post('/teacher/uploads',isAuth,UserController.uploads);



module.exports = router;