import { Schema, model, Document, Types } from 'mongoose';
import { ShiftSchedule } from './ShiftScheduleModel.js';
import { StaffMember } from './StaffMemberModel.js';

interface ShiftAssignmentRequestModel extends Document {
    shiftSheduleId: Types.ObjectId | ShiftSchedule;
    staffMemberIds: Types.ObjectId[];
}

// just to demonstrate the many to one relationship
const shiftAssignmentRequestModelSchema = new Schema<ShiftAssignmentRequestModel>({
    shiftSheduleId: {
        type: Types.ObjectId,
        required: true,
    },
    staffMemberIds: {
        type: [{ type: Types.ObjectId, ref: 'StaffMember' }],
        required: true,
    },
});

const ShiftAssignmentRequestModel = model<ShiftAssignmentRequestModel>(
    'ShiftAssignmentRequestModel',
    shiftAssignmentRequestModelSchema
);

export default ShiftAssignmentRequestModel;
