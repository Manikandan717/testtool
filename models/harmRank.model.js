import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHarmRank: String,

});

const HarmRank = mongoose.model('createHarmRank', CreSchema );

export default HarmRank;