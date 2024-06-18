import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createOverPref: String,

});

const OverPref = mongoose.model('createOverPref', CreSchema );

export default OverPref;