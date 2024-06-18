import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHonestPref: String,

});

const HonestPref = mongoose.model('createHonestPref', CreSchema );

export default HonestPref;