import { Schema, model } from "mongoose";
const staffMemberSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dates: [
        {
            type: Date,
            required: true,
        },
    ],
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
});
const StaffMemberModel = model("StaffMember", staffMemberSchema);
export default StaffMemberModel;
