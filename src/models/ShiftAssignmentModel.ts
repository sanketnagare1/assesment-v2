import { Schema, model, Document, Types } from 'mongoose';
import { ShiftSchedule } from './ShiftScheduleModel.js';
import { StaffMember } from './StaffMemberModel.js';

export interface ShiftAssignment extends Document {
    shiftSchedule: Types.ObjectId | ShiftSchedule;
    staffMember: Types.ObjectId | StaffMember;
}

// giving refrence to the ShiftSchedule and StaffMember model so that we can assign the members to shift Schedules
const shiftAssignmentSchema = new Schema<ShiftAssignment>({
    shiftSchedule: { 
        type: Schema.Types.ObjectId, 
        ref: 'ShiftSchedule', 
        required: true 
    },
    staffMember: { 
        type: Schema.Types.ObjectId, 
        ref: 'StaffMember', 
        required: true 
    },
});

const ShiftAssignmentModel = model<ShiftAssignment>('ShiftAssignment', shiftAssignmentSchema);

export default ShiftAssignmentModel;
