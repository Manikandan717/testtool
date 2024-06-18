import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createDecReason: String,

});

const AnnDecReason = mongoose.model('creDecReason', CreSchema );

export default AnnDecReason;