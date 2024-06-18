import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createName: String,

});

const AnnName = mongoose.model('creAnnName', CreSchema );

export default AnnName;