import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createHarmPref: String,

});

const HarmPref = mongoose.model('createHarmPref', CreSchema );

export default HarmPref;