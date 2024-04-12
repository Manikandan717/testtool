// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
    managerID: String,

});

const ManagerID = mongoose.model('creManagerId', CreSchema );

export default ManagerID;
