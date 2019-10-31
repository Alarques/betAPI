/* eslint-disable no-undef */
const request = require('supertest');
const {
    User
} = require('../../../models/user');
const {
    Sport
} = require('../../../models/sport');

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../../index');
        token = new User({
            userName: 'admin'
        }).generateAuthToken();
    });
    afterEach(async () => {
        await Sport.deleteMany({});
        server.close();
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/sports')
            .set('x-auth-token', token)
            .send({
                sportName: 'Football'
            });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if no token is invalid', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});