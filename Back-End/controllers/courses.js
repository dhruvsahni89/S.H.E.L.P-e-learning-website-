const {validationResult} = require('express-validator/check');
const courses = require('../models/courses');
const Users = require('../models/users');

exports.createcourse = (req, res, next) => {
    console.log("hello");
    console.log(req.file);
    // console.log(req.files[0].path)
  //  const errors = validationResult(req);
  //  if(!errors.isEmpty()){
   //     return res.status(422).json({message:'Validation Failed',errors: errors.array()});
  //  }

//    if(!req.file.isEmpty()){
//        const error = new Error('no image Provided');
//        error.statusCode = 422;
//        throw error;
//    }
    const title = req.body.title;
    const imageUrl = req.file.filename;
    // const videoUrl = req.files[0].filename;
    const name = req.body.name;
    const category = req.body.category;
    const willLearn = req.body.willLearn;
    const discription = req.body.discription;
    const discriptionLong = req.body.discriptionLong;
    const requirement = req.body.requirement
    console.log(imageUrl);
    const userID = req.body._id;

    const course = new courses({
        title: title,
        name: name,
        discription: discription,
        imageurl: imageUrl,
        creator: userID,
        category:category,
        // videourl:videoUrl,
        willLearn:willLearn,
        discriptionLong:discriptionLong,
        requirement:requirement,
        rating:0
    });

    course.save().then(result =>{
        console.log(result);
        res.status(201).json({message:'Course Created',newCourse: result})
    }).catch(err => {
        console.log(err);
    });
}

exports.edit=(req,res,next)=>{
    const courseId=req.body.courseId;
    courses.findById(courseId)
    .then(data =>{
        if(!data){
            const error = new Error('course not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(data)
    })
    .catch(err => {
        console.log(err);
    });

}
exports.update=(req,res,next)=>{
    const courseId = req.body.courseId;

    const title = req.body.title;
    console.log(title);
    const imageUrl = req.file.filename;
    // const videoUrl = req.files[0].filename;
    const name = req.body.name;
    const category = req.body.category;
    const willLearn = req.body.willLearn;
    const discription = req.body.discription;
    const discriptionLong = req.body.discriptionLong;
    const requirement = req.body.requirement
    console.log(imageUrl);
    
    console.log(courseId);

    courses.findById(courseId)
    .then(data=>{
        if(!data)  {
            const error = new Error('course not found.');
            error.statusCode = 404;
            throw error;
          }
          data.title=title;
          data.imageurl=imageUrl;
          data.name=name;
          data.category=category;
          data.willLearn=willLearn;
          data.discription=discription;
          data.discriptionLong=discriptionLong;
          data.requirement=requirement;
         return data.save()
    })
    .then(result => {
        res.status(200).json({ message: 'course updated!', result:result });
      })
}
exports.deleteCourse = (req, res, next) => {
    const courseId = req.body.courseId;
    courses.deleteOne({_id:courseId})
    .then((result) => {
        res.status(200).json({
          msg: "course deleted",
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    // courses.findById(courseId)
    //   .then(course => {
    //     if (!course) {
    //       const error = new Error('Could not find post.');
    //       error.statusCode = 404;
    //       throw error;
    //     }
    //     //deleting post
        
    //     return courses.findByIdAndRemove(courseId);
    //   })
    //   .then(removed => {
    //     console.log(removed);
    //     res.status(200).json({ message: 'Deleted course.' });
    //   })
    //   .catch(err => {
    //     if (!err.statusCode) {
    //       err.statusCode = 500;
    //     }
    //     next(err);
    //   });
  };

exports.bookmarkCourse = (req, res, next) =>{

    const courseID = req.body._id;
    const userID = req.body._userID;
    Users.findOneAndUpdate({_id:userID},{
        $addToSet:{ bookmarked:courseID} // addToSet add new value only if it is not present in array
    },{new:true}).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        res.json("Not Updated");
    }) //1st argument is what to find 2nd is what are changes

}

exports.unbookmarkCourse = (req, res, next) =>{

    const courseID = req.body._id;
    const userID = req.body._userID;
    console.log(courseID+" "+userID);
    Users.findOneAndUpdate({_id:userID},{
        $pull:{ bookmarked:courseID}
    },{new:true}).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        res.json("Unbookmark fail");
    }) //1st argument is what to find 2nd is what are changes

}


exports.showCourse = (req, res, next) =>{ //Route For showing a single course
    const courseID = req.params.courseID;

    courses.findById({_id:courseID}).then(course => {
        res.json({message:"Course Found",course:course}); // Returning the course to FrontEnd
    }).catch(err => {
        res.json("Course not found in DataBase");
    })
}


exports.rating = (req,res,next) => {
    

    //LOGIC 2
    // courses.findOneAndUpdate({_id:courseId},{
    //     $push:{rating:rating}
    // },{new:true}).then(data => {
    //     console.log(data);
    //     res.json(data);
    // }).catch(err => {
    //     res.json("Not Updated");
    // })


    // LOGIC! 1
    // courses.findById({_id:courseId}).then(course =>{

    //     console.log('prev total',course.rating);
    //     let newRating = (rating + course.rating)/2;
    //     course.rating = newRating.toPrecision(2);
    //     console.log("total",course.rating)
        
    //     course.save().then(result => {
    //         res.json({message:"rating updated",result:result});
    //     }).catch(err=>{
    //         res.json(err);
    //     })
    // }).catch(err => {
    //     console.log(courseId+" :- this is id");
    //     res.json("course not found!!!!!!!!!!!!");
    // })

    //LOGIC 3
    let rating  = req.body.rating;
    rating = Number(rating);
    console.log("RAting by user = ",rating)
    const courseId = req.body._id;

    courses.findById({_id:courseId}).then(course =>{

        console.log('prev total',course.rating.ratingSum);
        let newRating = (rating + course.rating.ratingSum);
        course.rating.ratingSum = newRating.toPrecision(2);
        course.rating.timesUpdated++; 
        console.log("total",course.rating.ratingSum)
        course.rating.ratingFinal = (course.rating.ratingSum/course.rating.timesUpdated).toPrecision(2);
        
        course.save().then(result => {
            res.json({message:"rating updated",result:result});
        }).catch(err=>{
            res.json(err);
        })
    }).catch(err => {
        console.log(courseId+" :- this is id");
        res.json("course not found!!!!!!!!!!!!");
    })

}

exports.videoUpload = (req,res,next) => {
    console.log("hi");
    const courseId = req.params.videocourseID;
    const file = req.files
    // const videoPathArray = [];

    // for(i in file){
    //     videoPathArray.push(file[i].filename);
    // }
    //console.log(videoPathArray)
    courses.findById({_id:courseId}).then(course =>{
        for(i in file){
            course.videoContent.push({videoUrl:file[i].filename}); 
        }
        course.save();
        res.json({message:"Video Uploaded",updatedCourse:course })
    }).catch(err => {
        res.json({error:err,message:"Course Not found"});
    })
}

exports.watchedVideo = (req,res,next) => {
    const courseID = req.body.courseID;
    const userID = req.body.userID; 
    const videoID = req.body.videoID;
    console.log("here:-bablu:-",courseID)
    courses.findById(courseID).then(course => {
        console.log("1")
        const videoContent = course.videoContent;
        videoContent.find(obj => {
            console.log("2")
            if(obj.videoUrl === videoID){
                console.log("3")
                obj.usersWatched.push(userID);
            }
            course.save().then(result => {
                console.log("4")
                res.json({message:"course saved",result:result})
            }).catch(err => {
                console.log(err + " Course not saved");
            })
        })
    }).catch(err => {
        console.log(err)
    })

}

exports.searchCourse = (req,res,next) => {
    const courseName = req.body.courseName
    courses.find({category:{$regex:courseName,$options:"ix"}},{category:1}).sort({"course": 1}) // sort 1 for ascending order
    .then(searchedCourse => {
        res.json({result:searchedCourse,messsage:"Search Result"});
    }).catch(err => {
        res.json({error:err, message:"No course from this name"});
    })
}
