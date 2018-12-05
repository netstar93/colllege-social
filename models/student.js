var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://nick:nitish93@ds229450.mlab.com:29450/college' , {useNewUrlParser:true});

var schema = new mongoose.Schema({
    id  : Number,
    name : String,
    dob : String,
    mobile_number :{
        type: Number,
        required : "Mobile number is required"
        },
    password : String,
    email_id :String,
    course:String,
    year:String
});
schema.add({roll_no : {type:Number,default: 1 }});
schema.add({image : {type:String }});
schema.add({
    posts: [{
            type :  mongoose.Schema.Types.ObjectId,
            ref : 'Posts'
    }]
})
// schema.post('save', function(next) {
//     var doc = this;
//     schema.findByIdAndUpdate({_id : this.id}, {$inc: { roll_no: 22} }, function(error, counter)   {
//         if(error)
//             return next(error);
//        // doc.testvalue = counter.seq;
//         next();
//     });
// });

module.exports =  mongoose.model('Students' , schema);