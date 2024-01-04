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


describe('Testing viewShiftDetails Controller', () => {

    test('should return 400 if date is not provided', async () => {

        const response = await request(app).get('/api/view-shift-details')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Bad Request')
    })

    test('should return 400 if date has an invalid format', async () => {
        const response = await request(app).get('/api/view-shift-details')
            .query({ date: '12-12-2023' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bad Request');
    });

    test('should return 400 if date is not found in the database', async () => {
        const response = await request(app).get('/api/view-shift-details')
            .query({ date: '2023-10-26' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bad Request');
    });

    test('should return shift details from the database', async () => {
        try {
            const shiftSchedule = await createShift('2023-12-26', 8, 16, 2);
    
            const response = await request(app).get('/api/view-shift-details')
                .send({ date: '2023-12-26' });
    
            // console.log('Response:', response.status, response.body); 
    
            expect(response.status).toBe(200);
            expect(response.body).toEqual(shiftSchedule);
        } catch (error) {
        }
    });

})