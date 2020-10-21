var mongoose = require('mongoose');
// const { stringAt } = require('pdfkit/js/data');
const courses = require('./courses');

const Schema = mongoose.Schema; //to create a new schema i.e db field 


const UserSchema = new Schema({
    isverified:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    interest:[
        {
            type:String,
            require:false
        }

    ],
    uploadCourses:[
        {
            type:Schema.Types.ObjectId,
            ref:'Courses',
            require:false
        }
    ],
    bookmarked:[
        {
        type:Schema.Types.ObjectId,
        ref:'Courses',
        require:false
    }
    ]

});


module.exports = User = mongoose.model('Users',UserSchema); //stored in users collection  and uses user schema

