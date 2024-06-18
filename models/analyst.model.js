import mongoose from 'mongoose';
import moment from 'moment';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: {
    type: String,
    required: true,
  },
  sessionOne: {
    type: String,
    required: false,
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
  },
  annotatorId: {
    type: String,
  },
  annName: {
    type: String,
  },
  declineReason: {
    type: String,
  },
  annBatch: {
    type: String,
  },
  annPrompt: {
    type: String,
  },
  buffer: {
    type: String,
  },
  bufferName: {
    type: String,
  },
  location: {
    type: String,
  },
  annReasonOne: {
    type: String,
  },
  annReasonTwo: {
    type: String,
  },
  overallPref: {
    type: String,
  },
  overallRank: {
    type: String,
  },
  responseOne: {
    type: String,
  },
  responseTwo: {
    type: String,
  },
  harmlessPref: {
    type: String,
  },
  harmlessRank: {
    type: String,
  },
  honestPref: {
    type: String,
  },
  honestRank: {
    type: String,
  },
 helpPref: {
    type: String,
  },
 helpRank: {
    type: String,
  },
  commentAnn: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  totalTime: {
    type: String,
  },
  toolTime: {
    type: String,
  },
  mins: {
    type: String,
  },
  sec: {
    type: String,
  },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  rejectionDescription: { type: String },
  sessionOne: [taskSchema], // Update to an array of tasks
  week: { type: Number, default: () => moment().format("W") },
  createdAt: { type: Date, default: () => moment().format('M D YYYY') },
});

// Middleware to enforce conditional required field
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'LIME_QC' && (!this.description || this.description.trim().length === 0)) {
    this.invalidate('description', 'Description is required for LIME_QC projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annotatorId || this.annotatorId.trim().length === 0)) {
    this.invalidate('annotatorId', 'annotatorId is required for VQA projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annName || this.annName.trim().length === 0)) {
    this.invalidate('annName', 'Name is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.declineReason || this.declineReason.trim().length === 0)) {
    this.invalidate('declineReason', 'Decline Reason is required for VQA projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annBatch || this.annBatch.trim().length === 0)) {
    this.invalidate('annBatch', 'Batch is required for VQA projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annPrompt || this.annPrompt.trim().length === 0)) {
    this.invalidate('annPrompt', 'Prompt is required for VQA projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annReasonOne || this.annReasonOne.trim().length === 0)) {
    this.invalidate('annReasonOne', 'Reason One is required for VQA projects');
  }
  next();
});

analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.annReasonTwo || this.annReasonTwo.trim().length === 0)) {
    this.invalidate('annReasonTwo', 'Reason Two is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.overallPref || this.overallPref.trim().length === 0)) {
    this.invalidate('overallPref', 'Overall Preference is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.responseOne || this.responseOne.trim().length === 0)) {
    this.invalidate('responseOne', 'Response One is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.responseTwo || this.responseTwo.trim().length === 0)) {
    this.invalidate('responseTwo', 'Response Two is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.harmlessPref || this.harmlessPref.trim().length === 0)) {
    this.invalidate('harmlessPref', 'Harmless Preference is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.harmlessRank || this.harmlessRank.trim().length === 0)) {
    this.invalidate('harmlessRank', 'Harmless Ranking is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.honestPref || this.honestPref.trim().length === 0)) {
    this.invalidate('honestPref', 'Honest Preference is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.honestRank || this.honestRank.trim().length === 0)) {
    this.invalidate('honestRank', 'Honest Ranking is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.helpPref || this.helpPref.trim().length === 0)) {
    this.invalidate('helpPref', 'Helpful Preference is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.helpRank || this.helpRank.trim().length === 0)) {
    this.invalidate('helpRank', 'Helpful Ranking is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.commentAnn || this.commentAnn.trim().length === 0)) {
    this.invalidate('commentAnn', 'Comment is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.startTime || this.startTime.trim().length === 0)) {
    this.invalidate('startTime', 'Start Time is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.endTime || this.endTime.trim().length === 0)) {
    this.invalidate('endTime', 'End Time is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.totalTime || this.totalTime.trim().length === 0)) {
    this.invalidate('totalTime', 'Total Time is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.toolTime || this.toolTime.trim().length === 0)) {
    this.invalidate('toolTime', 'Tool Time is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.mins || this.mins.trim().length === 0)) {
    this.invalidate('mins', 'Minutes is required for VQA projects');
  }
  next();
});
analystSchema.pre('validate', function(next) {
  if (this.projectName === 'VQA' && (!this.sec || this.sec.trim().length === 0)) {
    this.invalidate('sec', 'Seconds is required for VQA projects');
  }
  next();
});
const Analyst = mongoose.model('TaskData', analystSchema);

export default Analyst;
