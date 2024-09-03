const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  name:{
    type:String,
    minlength:[3,'Name must contain atleast 3 characters']
  },
  rollno: {
    type: Number,
    minlength:[7,'Rollno must have 7 digit'],
    maxlength:[7,'Rollno must have 7 digit']
  },
  className:{
    type:Number,
    minlength:[1,'Valid Class Name is required'],
    maxlength:[2,'Valid Class Name is required']
  },
  image:{
    type:String
  },
  password: {
    type: String,
  },
  confirmPassword:{
    type:String
  },
  markin: {
    type: Number,
  },
  markout: {
    type: Number,
  },
  attendance: [
    {
      markin: {
        type: Number,
      },
      markout: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
