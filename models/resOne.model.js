import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createResOne: String,

});

const ResOne = mongoose.model('createResOne', CreSchema );

export default ResOne;