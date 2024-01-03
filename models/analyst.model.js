import mongoose from "mongoose";
import moment from 'moment';

const Schema = mongoose.Schema

const analystSchema = new Schema({
    name: String,
    team: {
        type: String,
        required: true
      },
    empId: String,
 sessionOne: String,
      // sessionOne: Number,
      // sessionTwo: Number,
      // others: Number,
      // comments: String,
      // total: Number,

  projectName: {
    type: String,
    required: true
  },
  // sessionMinute: {
  //   type: String,
  //   required: true
  // },
  task: {
    type: String,
    required: true
  },
  managerTask: {
    type: String,
    required: true
  },
  dateTask: {
    type: Date,
    required: true
  },
    // TotalTime: Number,
    // ActiveTime: Number,
    // EntityTime: Number,
    week:{type: Number, default:()=>moment().format("W")},
    createdAt:{type:Date,default:()=>moment().format('M D YYYY')}
})

const Analyst = mongoose.model('Analyst',analystSchema)

export default Analyst;