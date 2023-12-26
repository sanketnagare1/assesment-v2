export function createShiftScheduleResponse(success, shiftSchedule) {
    if (success) {
        return {
            code: 200,
            response: `Shift Schedule details saved with id ${shiftSchedule?.id}`,
        };
    }
    else {
        return {
            code: 400,
            response: 'Bad Request',
        };
    }
}
export function addStaffMemberResponse(success, StaffMember) {
    if (success) {
        return {
            code: 200,
            response: `Staff member added successfully in the database with staff id ${StaffMember?.id}`,
        };
    }
    else {
        return {
            code: 400,
            response: 'Bad Request',
        };
    }
}
