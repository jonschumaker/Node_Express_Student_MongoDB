const mongoose = require('mongoose');
 
//Attributes of the students object
var studentSchema = new mongoose.Schema({
accessId: {
type: String,
required: 'This field is required!'
},
firstName: {
type: String,
required: 'This field is required!'
},
lastName: {
type: String,
required: 'This field is required!'
},
dob: {
type: String
},
address: {
type: String
},
category: {
type: String,
required: 'This field is required!'
},
year: {
type: String,
required: 'This field is required!'
},
courseDuration: {
type: String
},
gpa: {
type: String,
required: 'This field is required!'
}
});
 
mongoose.model('Students', studentSchema);