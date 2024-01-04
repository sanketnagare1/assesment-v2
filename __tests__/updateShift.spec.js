import request from 'supertest';
import app from '../dist/app'
import { closeTestDB, setupTestDB } from './setupDb';
import ShiftScheduleModel from '../dist/models/ShiftScheduleModel';
import mongoose from 'mongoose';

beforeAll(async () => {
    setupTestDB()
});

afterAll(async () => {
    closeTestDB()
});


const createShift = async (date, startTime, endTime, requiredStaffCount) => {
    const shiftSchedule = new ShiftScheduleModel({ date, startTime, endTime, requiredStaffCount });
    return shiftSchedule.save();
}


describe('Testing updateShiftDetails controller', () => {

    test('should return 400 if any parameter is missing', async () => {
        const response = await request(app).put('/api/update-shift-details')
            .send({ 
                date: '2023-12-26' 
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bad Request');
    });

    test('should return 400 if shift details not found for the given id', async () => {
        const response = await request(app).put('/api/update-shift-details')
            .send({ 
                id: new mongoose.Types.ObjectId(), 
                date: '2023-12-26', 
                startTime: 8, 
                endTime: 16, 
                requiredStaffCount: 2 
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Shift Details not found for the given id');
    });

    test('should update shift details successfully', async () => {
        const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);
    
        const updatedDetails = {
            id: shiftSchedule._id,
            date: '2023-12-27',
            startTime: 9,
            endTime: 17,
            requiredStaffCount: 3
        };
    
        const response = await request(app).put('/api/update-shift-details')
            .send(updatedDetails);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Shift Details Updated Successfully');
    
        // Verify that the details are updated in the database
        const updatedSchedule = await ShiftScheduleModel.findById(shiftSchedule._id);
        
        expect(updatedSchedule.date).toEqual(new Date(updatedDetails.date));
        expect(updatedSchedule.startTime).toBe(updatedDetails.startTime);
        expect(updatedSchedule.endTime).toBe(updatedDetails.endTime);
        expect(updatedSchedule.requiredStaffCount).toBe(updatedDetails.requiredStaffCount);
    });

})