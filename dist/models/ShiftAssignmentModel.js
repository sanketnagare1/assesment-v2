import { Schema, model } from 'mongoose';
// giving refrence to the ShiftSchedule and StaffMember model so that we can assign the members to shift Schedules
const shiftAssignmentSchema = new Schema({
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
const ShiftAssignmentModel = model('ShiftAssignment', shiftAssignmentSchema);
export default ShiftAssignmentModel;
