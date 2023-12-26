import { Schema, model, Document } from "mongoose";

export interface StaffMember extends Document {
    name: string;
    dates: Date[];
    startTime: number;
    endTime: number;
}

const staffMemberSchema = new Schema<StaffMember>({
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

const StaffMemberModel = model<StaffMember>("StaffMember", staffMemberSchema);

export default StaffMemberModel;
