var express = require('express');
var router = express.Router();

var student = require('../models/student');
var postModel = require('../models/post');

var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({storage: storage});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index' ,{title : 'Home Page'});
});
router.get('/register', function (req, res, next) {
  res.render('student/register', {
    title: 'Student Sign Up'
  });
});

router.post('/register',  upload.single('image') , function (req, res, next) {
  var data = req.body;
  data.image = req.file.filename;
  var stu = new student(data);
  stu.save(function (err) {
    if (err) console.log(err);
    req.flash('success' , 'Account created')
    res.redirect('/');
  });
});

router.post('/', function (req, res, next) {
  var data = req.body;
  
  student.findOne({
    'mobile_number': data.mobile_number,
    'password': data.password
  }, function (err, student) {
    if (err) console.log(err);
    if (!student) {
      res.redirect('/');
    } else {
      req.flash('success', "Login Successful");
      req.session.student = student;
      req.session.save();
      res.redirect('dashboard');
    }
  });
});

router.post('/postSave', validateStudent, async (req, res, next) => {
  const STU = await student.findOne({
    _id: req.session.student._id
  });

  if (typeof STU != 'undefined') {
    var post = new postModel();
    post.post = req.body.post;
    post.post_date = Date.now();
    post.student = STU._id;
    try {
      await post.save();
      STU.posts.push(post.id);
      console.log("newPost " + post.id)
      STU.save(function (err, result) {
        if (!err) {
          req.flash('success', "Post is successfully posted");
          res.redirect('/dashboard');
        } else {
          req.flash('errror', "Something Wrong");
          res.redirect('/dashboard');
        }
      });
    } catch (err) {
      console.error("ERROR :: " + err);
    }
  }
});

router.get('/logout', validateStudent,async function (req, res, next) {
  req.session.destroy(() => {
    res.redirect('/');
  });
})

router.get('/dashboard', validateStudent,async function (req, res, next) {
  const _student = await student.findOne({
    _id: req.session.student._id
  }).populate('posts');

  res.render('student/home', {
    title: 'Welcome ' + _student.name,
    student: _student
  });
})

function validateStudent(req, res, next) {
  if (typeof req.session.student == 'undefined') {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = router;