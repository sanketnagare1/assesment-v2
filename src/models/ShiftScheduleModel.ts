import { Schema, Document, model } from "mongoose";

export interface ShiftSchedule extends Document {
    date: Date;
    startTime: number;
    endTime: number;
    requiredStaffCount: number;
}

const shiftScheduleSchema = new Schema<ShiftSchedule>({
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

const ShiftScheduleModel = model<ShiftSchedule> ('ShiftSchedule', shiftScheduleSchema);

export default ShiftScheduleModel;
