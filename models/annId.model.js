import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createAnnotator: String,
  createName: String,

});

const AnnId = mongoose.model('creAnnId', CreSchema );

export default AnnId;