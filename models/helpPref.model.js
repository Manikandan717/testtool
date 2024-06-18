import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHelpPref: String,

});

const HelpPref = mongoose.model('createHelpPref', CreSchema );

export default HelpPref;