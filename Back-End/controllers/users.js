const fs = require('fs');
const path = require('path');
const Courses = require('../models/courses')
const PDFDocument=require('pdfkit');
const users = require('../models/users');


exports.homepage = (req, res, next) => {

    const category = req.params.category;
    console.log(category)
    if(category === "all"){

        Courses.find().then(course => {
            console.log(course)
            res.json({message:"Course Found",course:course});
        }).catch(err =>{
            res.json("No Courses Found")
        });

    }
    else{
        Courses.find({category: category}).then(course => {
            console.log(course)
            res.json({message:"Course Found",course:course});
        }).catch(err =>{
            res.json("No Courses Found")
        });

    }
    
}

exports.userPage =  (req, res, next) => {
    const userId = req.params.userId;
    
    users.findById({_id:userId}).populate('bookmarked').exec().then(course => {
        
        res.json({message:"Bookmarked Course",course:course});


 //---------------------------------------------------------------------------       
        // for(i in courseArray){
        //     //  console.log(courseArray[i] +"   "+ i);
        //     Courses.findById({_id:courseArray[i]}).then(course => {
        //         console.log("i am here " + i);
        //        courses.push(course);
        //     }).catch(err => {
        //         res.json(err);
        //     })
        // }
//----------------------------------------------------------------------        
    }).catch(err =>{res.status(400).json(err)})
}



//----------------------------------------------------------------------------------------------------------------------------

exports.getinvoice =(req,res,next) =>{
    const userId=req.params.userId;
    courses.findOne({_id:userId})
    .then(user=>{
        if(!user){
            res.json('no such course id');
        }

    //   console.log("hello ji");
    const invoiceName = 'invoice-' + userId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const pdfdoc=new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
    pdfdoc.pipe(fs.createWriteStream(invoicePath));
    pdfdoc.pipe(res);
    pdfdoc.fontSize(20).text('HERE IS SOME DESCRIPTION AND TIPS ABOUT THE COURSE , HAVE A GREAT JOURNEY , EXPERIENCE BEST COURSES BY EXPERTIES! THANKYOU ');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('---------------CREATOR------------------');
    pdfdoc.moveDown();
    pdfdoc.text(user.name);
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('------------DESCRIPTION-------------');
    pdfdoc.moveDown();
    pdfdoc.text(user.discription);
    pdfdoc.moveDown();
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('TIPS');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.text('1. Treat an online course like a “real” course.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.text('2. Hold yourself accountable');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.text(' Practice time management.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.text('4. Create a regular study space and stay organized.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.text('5. Eliminate distractions.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(20).text('SOME TIPS FOR FULL STACK DEVELOPER!!');

    pdfdoc.text('--------------------------------------------');
    pdfdoc.fontSize(18).text('1 :Server, Network, and Hosting Environment.');
    pdfdoc.moveDown();
    pdfdoc.text(' a:This involves understanding what can break and why, taking no resource for granted.');
    pdfdoc.text('b:Appropriate use of the file system, cloud storage, network resources, and an understanding of data redundancy and availability is necessary.');
    pdfdoc.text('c:How does the application scale given the hardware constraints?');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('2 :Data Modeling');
    pdfdoc.moveDown();
    pdfdoc.text('a: If the data model is flawed, the business logic and higher layers start to need strange (ugly) code to compensate for corner cases the data model doesn’t cover.');
    pdfdoc.text('b: Full stack developers know how to create a reasonably normalized relational model, complete with foreign keys, indexes, views, lookup tables, etc.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text(' 3 :API layer / Action Layer / MVC');
    pdfdoc.moveDown();
    pdfdoc.text('a: How the outside world operates against the business logic and data model.');
    pdfdoc.text('b: Frameworks at this level should be used heavily.');
    pdfdoc.text('c: Full stack developers have the ability to write clear, consistent, simple to use interfaces. The heights to which some APIs are convoluted repel me.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text(' 4 :User Interface');
    pdfdoc.moveDown();
    pdfdoc.text('a: Full stack developers: i) understand how to create a readable layout, or (ii) acknowledge they need help from artists and graphic designers. Either way, implementing a good visual design is key.');
    pdfdoc.text('b: Can include mastery of HTML5 / CSS.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('5: Understanding what the customer and the business need.');
    pdfdoc.moveDown();
    pdfdoc.text('a: Now we are blurring into the line of architect, but that is too much of a hands off role.');
    pdfdoc.text('b: Full stack developers have a grasp of what is going on in the field when the customer uses the software. They also have a grasp of the business.');
    pdfdoc.text('--------------------------------------------');
    pdfdoc.moveDown();
    pdfdoc.fontSize(18).text('IF YOU HAVE ANY QUERY , YOU CAN CONTACT US ON ONE OF MENTIONED EMAILS');
    pdfdoc.moveDown();
    pdfdoc.text('abhiautar123@gmail.com');
    pdfdoc.text('dhruvsahni89@gmail.com');
    pdfdoc.text('ayush.verma8750@gmail.com');

    pdfdoc.end();
})
.catch(err =>{
    console.log(err);
    next(err)});
}


exports.suggestion=(req,res,next)=>{
    const userId=req.body.userId;
    const interest=req.body.interest;  //taking array from front end consisting of interests of users
    console.log(userId);              
    console.log(interest);
    users.findOne({_id:userId})           //finding that user by his/her id and saving that array in the database
    .then(user=>{
    user.interest=interest;
    user.save();
    res.json("preferences stored");
        })
}

exports.preference=(req, res, next) => {
    const userId=req.body.userId;
    users.findOne({_id:userId})
    .then(user=>{                                //display preferences made earlier
    //    var category1=user.interest[0];          //display courses of category which were chosen by user as his/her preference
    //    var category2=user.interest[1];
    //    var category3=user.interest[2];    
        // console.log(category1);
        var coursesarray=[];                   //making an empty array
        var x=0;                
        user.interest.forEach(interest => {         //for every category user has chosen , finding courses of that category from his/her database
            console.log(interest)
            Courses.find({category:interest})
            .then(result=>{
                x++;
                result.forEach(all=>{                  //adding all the data of courses array into a single array
                    coursesarray.push(all);

                })

                if(user.interest.length===x){
                    res.json({coursesarray:coursesarray})
                }
               
                // console.log({coursesarray:coursesarray});
            })
           
            
        });
        //console.log(coursesarray);
        // coursesarray.push("abhishek srivastav");
        // coursesarray.push("himnashu");
       

        Courses.findOne({category:category1})
        .then(found=>{
            coursesarray.push(found);

        // courses.find({category:category1})
        // .then(found=>{
        // coursesarray=found;
        // coursesarray.push(found);
        // res.json(coursesarray);
        // coursesarray=[...coursesarray,found];
        // console.log(found);

           
        })
       

        Courses.findOne({category:category2})
        .then(found1=>{
            coursesarray.push(found1);

    //     courses.find({category:category2})
    //     .then(found1=>{
            
    //         coursesarray.push(found1);
    //         // console.log(found1);
    //         // coursesarray1=found1;

           
           
        })
        

        Courses.findOne({category:category3})
        .then(found2=>{
            coursesarray.push(found2);
            res.json(coursesarray);
        })

    //     courses.find({category:category3})
    //     .then(found2=>{
    //         coursesarray.push(found2);
    //         // console.log(found2);
    //         // coursesarray=[...coursesarray,found2];
    //         // coursesarray2=found2;
    //         res.json(coursesarray);

           
          
           
    //     })
    // //   var interest1=coursesarray.concat(coursesarray1);
    //     // console.log(interest1);
       
    //     // coursesarray.push(one);
    //     // coursesarray.push(two);
    //     // coursesarray.push(two);

     
})
}

exports.uploads = (req,res,next) => {

       const userId=req.body.userId;
       courses.find({creator:userId})    //finding user by his creator id which was generated when he uploaded
       .then(data=>{                     //some courses and  , displaying all the courses he uploaded
           console.log(data)
           console.log("dhruvji")
           res.json({data:data});

       })
       .catch

   
}