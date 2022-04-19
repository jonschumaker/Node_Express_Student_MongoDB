const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/studentDB', {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log('Failed to connect with MongoDB. Error is: ' + err)
    } else {
        console.log('Successfully connected with MongoDB!')
    }
});
 
//Connecting Node and MongoDB
require('./studentsSchema');