var express = require('express');
var router = express.Router();
var student = require('../models/student');
/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('student/register' , {title : 'Student Sign Up'});
});

router.post('/register', function(req, res, next) {
  var data = req.body;
  var stu  = new student(data);
  stu.save(function(err){
    if(err) console.log(err);
    res.redirect('/');
  });
});

router.post('/login', function(req, res, next) {

});

module.exports = router;
