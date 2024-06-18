import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHonestRank: String,

});

const HonestRank = mongoose.model('createHonestRank', CreSchema );

export default HonestRank;