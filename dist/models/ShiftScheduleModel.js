import { Schema, model } from "mongoose";
const shiftScheduleSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Number,
        required: true,
        min: 1,
        max: 24
    },
    endTime: {
        type: Number,
        required: true,
        min: 1,
        max: 24
    },
    requiredStaffCount: {
        type: Number,
        required: true
    },
});
const ShiftScheduleModel = model('ShiftSchedule', shiftScheduleSchema);
export default ShiftScheduleModel;
