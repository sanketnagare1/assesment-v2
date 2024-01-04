import request from 'supertest';
import app from '../dist/app'
import { closeTestDB, setupTestDB } from './setupDb';
import ShiftScheduleModel from '../dist/models/ShiftScheduleModel';
import StaffMemberModel from '../dist/models/StaffMemberModel';
import ShiftAssignmentModel from '../dist/models/ShiftAssignmentModel';
import mongoose from 'mongoose';

beforeAll(async () => {
    setupTestDB()
});

afterAll(async () => {
    closeTestDB()
});

const createShift = async(date, startTime, endTime, requiredStaffCount) => {
    const shiftSchedule = new ShiftScheduleModel({date, startTime, endTime, requiredStaffCount});
    return shiftSchedule.save();
}

const createMember = async(name, dates, startTime, endTime) => {
    const staffMember = new StaffMemberModel({name, dates, startTime, endTime});
    return staffMember.save();
}

describe('Testing assignStaffToShifts Controller', () => {

    test('should return 400 if shiftSheduleId is missing', async () => {
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                staffMemberIds: ['some-id'],
            });
    
        expect(response.status).toBe(400);
    });
    
    test('should return 400 if staffMemberIds are missing', async () => {

        const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);
    
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
            });
    
        expect(response.status).toBe(400);
    });
    
    test('should return 400 if staffMemberIds is not an array', async () => {

        const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);
    
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: '',
            });
    
        expect(response.status).toBe(400);
    });

    test('should return 400 if shiftSheduleId is invalid', async () => {
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: 'invalidid',
                staffMemberIds: ['id'],
            });
    
        expect(response.status).toBe(400);
    });

    test('should return 400 if staffMemberIds contain invalid ids', async () => {
        const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);

        const staffMember = await createMember('Sanket One', ['2023-12-12', '2023-12-13'], 13, 21);
    
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: [staffMember.id, 'invalid-id'],
            });
    
        // console.log('Response Body:', response.body); 
        expect(response.status).toBe(400);
    });

    test('should return 400 if shiftSchedule is not present in the database', async () => {

        const staffMember = await createMember('Sanket One', ['2023-12-12', '2023-12-13'], 13, 21);

        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                // random new object id that does not present in db
                shiftSheduleId: new mongoose.Types.ObjectId(),
                staffMemberIds: [staffMember.id],
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid shift schedule ID');
    });

    // if schedule is full
    test('should return 400 if assigned staff count exceeds required staff count', async () => {

        const shiftSchedule = await createShift('2023-12-26', 8, 16, 1);

        const staffMember1 = await createMember('sanketone', ['2023-12-26'], 8, 16);

        const staffMember2 = await createMember('sankettwo', ['2023-12-26'], 8, 16);
    
        //assigned maximum allowed staff
        await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: [staffMember1.id],
            });
    
        //trry assign one more staff
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: [staffMember2.id],
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Given shiftShedule is full you can try assigning staff in different shift');
    });

    // if staff is not available on that day
    test('should return 400 if some staff members are not available on the given shift date', async () => {
        const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);
        const staffMember1 = await createMember('Sanket one', ['2023-12-26'], 8, 16);

        // not available
        const staffMember2 = await createMember('Sanket two', ['2023-12-27'], 8, 16);  
    
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: [staffMember1.id, staffMember2.id],
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Some staffs are not available on the given shift date');
    });

    // if staff is not available on that time
    test('should return 400 if some staff members are not available in the time range of the given shift', async () => {
        const shiftSchedule = await createShift('2023-12-26', 12, 22, 2);
        const staffMember1 = await createMember('sanket one', ['2023-12-26'], 12, 18);
        const staffMember2 = await createMember('sanket two', ['2023-12-26'], 12, 24);
    
        const response = await request(app).put('/api/assign-staff-to-shifts')
            .send({
                shiftSheduleId: shiftSchedule.id,
                staffMemberIds: [staffMember1.id, staffMember2.id],
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', `Staff members with ID ${staffMember2.id} are not available in the time range of the given shift`);
    });


    test('should assign staff members to shift succesfully', async() => {

        const shiftSchedule = await createShift('2023-12-12', 12, 22, 3);

        const staffMember1 = await createMember('Sanket One', ['2023-12-12', '2023-12-13'], 13, 21);
        const staffMember2 = await createMember('Sanket Two', ['2023-12-12', '2023-12-14'], 15, 20);

        const response = await request(app).put('/api/assign-staff-to-shifts')
        .send({
            shiftSheduleId: shiftSchedule.id,
            staffMemberIds: [staffMember1.id, staffMember2.id]
        })

        // console.log(response.status, response.body)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response', 'Staff assigned to shifts successfully')

        // check in db 
        const assignments = await ShiftAssignmentModel.find({
            shiftSchedule: shiftSchedule.id,
            staffMember: { $in: [staffMember1.id, staffMember2.id] },
        });
    
        expect(assignments).toHaveLength(2);
    })
})
