import mongoose from "mongoose";
import moment from 'moment';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    type: String,
    required: true,
  },
  sessionOne: {
    type: String,
    required: true,
  },
});

const analystSchema = new Schema({
  name: String,
  team: {
    type: String,
    required: true,
  },
  empId: String,
  projectName: {
    type: String,
    required: true,
  },
  managerTask: {
    type: String,
    required: true,
  },
  teamLead: {
    type: String,
    required: true,
  },
  idleTasks: {
    type: Number,
  },
  productionTasks: {
    type: Number,
  },
  dateTask: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  // Rejection details
  rejectionReason: { type: String },
  rejectionDescription: { type: String },
  sessionOne: [taskSchema], // Update to an array of tasks
  week: { type: Number, default: () => moment().format("W") },
  createdAt: { type: Date, default: () => moment().format('M D YYYY') },
});

const Analyst = mongoose.model('TaskData', analystSchema);

export default Analyst;
