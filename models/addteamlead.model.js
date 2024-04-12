// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createTeamLead: String,

});

const AddTeamLead = mongoose.model('creTeamLead', CreSchema );

export default AddTeamLead;
