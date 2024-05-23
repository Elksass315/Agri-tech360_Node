const request = require('supertest');
let server;

describe('/api/weather', () => {
    beforeEach(() => { server = require('../../../index') });
    afterEach(() => { server.close() });

    describe('GET /', () => {
        it('should return 400 no city provid', async () => {
            const res = await request(server).get('/api/weather');
            expect(res.status).toBe(400);
        });
        
        it('should return weather data', async () => {
            const res = await request(server).get('/api/weather').send({ city: 'Lagos' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Lagos');
        });
    });
});