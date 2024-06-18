import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHelpRank: String,

});

const HelpRank = mongoose.model('createHelpRank', CreSchema );

export default HelpRank;