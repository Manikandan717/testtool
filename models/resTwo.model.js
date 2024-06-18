import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createResTwo: String,

});

const ResTwo = mongoose.model('createResTwo', CreSchema );

export default ResTwo;