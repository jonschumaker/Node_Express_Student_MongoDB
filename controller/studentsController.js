//Import the dependencies
const express = require('express');
const mongoose = require('mongoose');
const {response} = require("express");
//Creating a Router
var router = express.Router();
//Link
const Students = mongoose.model('Students');
 
//Router Controller for READ request
router.get('/',(req, res) => {
res.render("students/studentsInsertUpdate", {
viewTitle: "Insert a New Student "
});
});
 
//Router Controller for UPDATE request
router.post('/', (req,res) => {
    console.log('router.post:');
    if (req.body._id == '') {
        insertIntoMongoDB(req, res);
    } else {
        updateIntoMongoDB(req, res);
    }
});
 
//Creating function to insert data into MongoDB
function insertIntoMongoDB(req,res) {
var student = new Students();
student.accessId = req.body.accessId;
student.firstName = req.body.firstName;
student.lastName = req.body.lastName;
student.dob = req.body.dob;
student.address = req.body.address;
student.category = req.body.category;
student.year = req.body.year;
student.courseDuration = req.body.courseDuration;
student.gpa = req.body.gpa;
student.save((err, doc) => {
    if (!err) {
        res.redirect('students/list');
    } else {
        console.log('Failed to insert student record with error: ' + err);
    }
    res.end()
});
}
 
//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
    console.log('updateIntoMongoDB:');
    Students.findOneAndUpdate({ _id: req.body._id }, req.body, (err, doc) => {
        if (!err) { res.redirect('students/list'); }
        else {
            if (err.name === 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("students/studentsInsertUpdate", {
                //Retaining value to be displayed in the child view
                    viewTitle: 'Update student details',
                    student: req.body
                });
            }
            else
            console.log('Failed to update student information with error: ' + err);
        }
    });
}

//Router to retrieve the complete list of available students
router.get('/list', (req,res) => {
Students.find((err, docs) => {
if(!err){
res.render("students/list", {
list: docs
});
}
else {
console.log('Failed to retrieve the students information with error: '+ err);
}
}).lean();
});

//Router to retrieve the complete list of aggregated credits of students
router.get('/credits', (req,res) => {
Students.find((err, docs) => {
if(!err){
res.render("students/credits", {
credits: docs
});
}
else {
console.log('Failed to retrieve the credits information with error: '+ err);
}
}).lean();
});

//Creating a function to implement input validations
function handleValidationError(err, body) {
for (field in err.errors) {
switch (err.errors[field].path) {
case 'accessId':
body['accessIdError'] = err.errors[field].message;
break;
case 'firstName':
body['firstNameError'] = err.errors[field].message;
break;
case 'lastName':
body['lastNameError'] = err.errors[field].message;
break;
case 'category':
body['categoryError'] = err.errors[field].message;
break;
case 'year':
body['yearError'] = err.errors[field].message;
break;
case 'courseDuration':
body['courseDurationError'] = err.errors[field].message;
break;
case 'gpa':
body['gpaError'] = err.errors[field].message;
break;
default:
break;
}
}
}
/*
router.get('/update/:id', (req, res) => {
Students.findById(req.params.id, (err, doc) => {
if (!err) {
res.render("students/studentsInsertUpdate", {
viewTitle: "Update student details",
students: doc
});
}
else { console.log('Failed to update students details with error: ' + err); }
})
});
*/
//Router to update a student using it's ID

router.get('/:id', (req, res) => {
    Students.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("students/studentsInsertUpdate", {
                viewTitle: "Update student Details",
                students: doc
            });
            console.log('Successfully hit update with no error');}
else { console.log('Failed to update students details with error: ' + err); }
}).lean();
});


//Router Controller for DELETE request
router.get('/delete/:id', (req, res) => {
Students.findByIdAndRemove(req.params.id, (err, doc) => {
if (!err) {
res.redirect('/students/list');
}
else { console.log('Failed to delete students details with error: ' + err); }
})
});

//        Students.aggregate([{$group:{_id:{'accessId':'$accessId','courseDuration':'$courseDuration'}, count:{$sum:1}}}], function(err,  Students) {
                          //( [ { $project: { item: 1, total: { $subtract: [ 60, "$courseDuration" ] } } } ] )
//$subtract:{'60': "courseDuration"}
//Router Controller for Aggregate request
router.route('/credits/:id')
    .get(function(req, res) {
        Students.aggregate( [ { $project: { item: 1, total: { $subtract: [ 60, "$courseDuration"] } } } ] , function(err,  Students) {
            if (err) res.send(err);
            //console.log('did not calculate aggregate properly... redirecting to list');
            //res.render('/students/credits');
            res.json(Students);
        });
    });
 
module.exports = router;