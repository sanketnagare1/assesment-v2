import request from 'supertest';
import app from '../dist/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShiftScheduleModel from '../dist/models/ShiftScheduleModel';


// if we dont mock the model then real entry will be inserted in database
// jest.mock('../dist/models/ShiftScheduleModel');

dotenv.config();

//local MongoDB instance
const localMongoUri = process.env.URL;

beforeAll(async () => {
    await mongoose.connect(localMongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
});


const createShift = async(date, startTime, endTime, requiredStaffCount) => {
    const shiftSchedule = new ShiftScheduleModel({date, startTime, endTime, requiredStaffCount});
    return shiftSchedule.save();
}


describe("Testing CreateShiftSchedule Controller", () => {

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/api/create-shift-shedule')
            .send({

            })
        expect(response.status).toBe(400);
    })

    test('should return 400 if date is invalid', async () => {
        const response = await request(app).post('/api/create-shift-shedule')
            .send({
                date: 'inavlid-date',
                startTime: 1,
                endTime: 24,
                requiredStaffCount: 3
            })

        expect(response.status).toBe(400)
    })

    test('should return 400 if start or end time is invalid', async () => {
        const response = await request(app).post('/api/create-shift-shedule')
            .send({
                date: '2023-12-26',
                startTime: -1,
                endTime: 23,
                requiredStaffCount: 3
            })
        expect(response.status).toBe(400)
    })

    test('should return 400 if requredStaffcount is negative', async () => {
        const response = await request(app).post('/api/create-shift-shedule')
            .send({
                date: "2023-12-26",
                startTime: 12,
                endTime: 24,
                requiredStaffCount: -3
            })
        expect(response.status).toBe(400)
    })


    test('should create a schedule', async () => {

        const response = await request(app).post('/api/create-shift-shedule')
            .send({
                date: '2023-12-26',
                startTime: 12,
                endTime: 24,
                requiredStaffCount: 3,
            });

        expect(response.status).toBe(200);
    }, 10000);
})










// test('should create a schedule', async () => {
//     const mockSave = jest.fn();
//     ShiftScheduleModel.mockImplementation(() => ({ save: mockSave }));
//     try {
//         const response = await request(app).post('/api/create-shift-shedule')
//             .send({
//                 date: '2023-12-26',
//                 startTime: 1,
//                 endTime: 24,
//                 requiredStaffCount: 3,
//             });

//         console.log('Response:', response.status, response.body);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message');
//         expect(mockSave).toHaveBeenCalled();
//     } catch (error) {
//         console.error('error:', error);
//     }
// }, 10000);



























