var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://nick:nitish93@ds229450.mlab.com:29450/college' , {useNewUrlParser:true});

var postSchema = new mongoose.Schema({
    student_id : Number,
    post_date : Date,
    post : String,
    student : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Students'
    }
})

module.exports = mongoose.model('Posts' , postSchema);