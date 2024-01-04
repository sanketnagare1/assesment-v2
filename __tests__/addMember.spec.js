import request from 'supertest';
import app from '../dist/app'
import { closeTestDB, setupTestDB } from './setupDb';

beforeAll(async () => {
    setupTestDB()
});

afterAll(async () => {
    closeTestDB()
});


describe('Tesing addStaffMember Controller', () => {
    test('should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({});

        expect(response.status).toBe(400);
    });

    test('should return 400 if name contains invalid characters', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: 'Sanket124',
                dates: ['2023-12-26', '2023-12-27'],
                startTime: 8,
                endTime: 17,
            });

        expect(response.status).toBe(400);
    });

    test('should return 400 if dates are not provided or empty', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: 'Sanket',
                startTime: 8,
                endTime: 17,
            });

        expect(response.status).toBe(400);
    });

    test('should return 400 if dates are not in proper format', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: 'Sanket',
                dates: ['invalid-date', '2023-12-27'],
                startTime: 8,
                endTime: 17,
            });

        expect(response.status).toBe(400);
    });

    test('should return 400 if dates contain duplicates', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: 'John Doe',
                dates: ['2023-12-26', '2023-12-26'],
                startTime: 8,
                endTime: 17,
            });

        expect(response.status).toBe(400);
    });

    test('should return 400 if startTime or endTime are invalid', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: 'Sanket',
                dates: ['2023-12-26', '2023-12-27'],
                startTime: -1,
                endTime: 25,
            });

        expect(response.status).toBe(400);
    });



    test('should create a member', async () => {
        const response = await request(app).post('/api/add-staff-member')
            .send({
                name: "Sanket",
                dates: ["2023-12-26", "2023-12-27"],
                startTime: 12,
                endTime: 14
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    }, 10000);
}) 