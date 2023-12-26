import { Schema, model, Types } from 'mongoose';
// just to demonstrate the many to one relationship
const shiftAssignmentRequestModelSchema = new Schema({
    shiftSheduleId: {
        type: Types.ObjectId,
        required: true,
    },
    staffMemberIds: {
        type: [{ type: Types.ObjectId, ref: 'StaffMember' }],
        required: true,
    },
});
const ShiftAssignmentRequestModel = model('ShiftAssignmentRequestModel', shiftAssignmentRequestModelSchema);
export default ShiftAssignmentRequestModel;
