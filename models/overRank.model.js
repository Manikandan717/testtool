import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createOverRank: String,

});

const OverRank = mongoose.model('createOverRank', CreSchema );

export default OverRank;