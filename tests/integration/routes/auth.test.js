/* eslint-disable no-undef */
const request = require('supertest');
const {
    User
} = require('../../../models/user');
const bcrypt = require('bcrypt');

let server;

describe('/api/auth', () => {
    beforeEach(async () => {
        server = require('../../../index');
        const user = new User({
            userName: 'test',
            email: 'test@test.com',
            password: '123456789'
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    });
    afterEach(async () => {
        server.close();
        await User.deleteMany({});
    });

    describe('POST /', () => {
        const exec = async () => {
            return await request(server)
                .post('/api/auth/')
                .send(userPost);
        }

        let userPost;


        it('should return 400 if the input is not correct', async () => {
            userPost = {
                userName: 'te',
                password: '123456'
            }
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if the user is not valid', async () => {
            const userPost = {
                userName: 'testtt',
                password: '123456789'
            }
            const res = await request(server)
                .post('/api/auth/')
                .send(userPost);
            expect(res.status).toBe(400);
        });

        it('should return 400 if the password is not valid', async () => {
            const userPost = {
                userName: 'test',
                password: '12345678999'
            }
            const res = await request(server)
                .post('/api/auth/')
                .send(userPost);
            expect(res.status).toBe(400);
        });

        it('should return a valid token if user and password is correct', async () => {
            const userPost = {
                userName: 'test',
                password: '123456789'
            }
            const res = await request(server)
                .post('/api/auth/')
                .send(userPost);
            expect(res.status).toBe(200);
            expect(res.text).not.toBeNull();
        });
    });
});