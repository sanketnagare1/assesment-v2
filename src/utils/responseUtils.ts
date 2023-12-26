import { ShiftSchedule } from "../models/ShiftScheduleModel.js";
import { StaffMember } from '../models/StaffMemberModel.js';

interface ApiResponse {
    code: number;
    response: string;
}


export function createShiftScheduleResponse(success: boolean, shiftSchedule?: ShiftSchedule): ApiResponse {
    if (success) {
        return {
            code: 200,
            response: `Shift Schedule details saved with id ${shiftSchedule?.id}`,
        };
    } else {
        return {
            code: 400,
            response: 'Bad Request',
        };
    }
}

export function addStaffMemberResponse(success: boolean, StaffMember?: StaffMember): ApiResponse {
    if (success) {
        return {
            code: 200,
            response: `Staff member added successfully in the database with staff id ${StaffMember?.id}`,
        };
    } else {
        return {
            code: 400,
            response: 'Bad Request',
        };
    }
}
