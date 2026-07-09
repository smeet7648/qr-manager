const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
{
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    qrCode:String,

    date:String,

    status:{
        type:String,
        default:"Present"
    }
},
{
    timestamps:true
});

module.exports=mongoose.model("Attendance",attendanceSchema);