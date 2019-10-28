/* eslint-disable no-undef */
const request = require('supertest');
const {
    Sport
} = require('../../../models/sport');
const {
    User
} = require('../../../models/user');
const mongoose = require('mongoose');

let token;
let server;

describe('/api/sports', () => {
    beforeEach(() => {
        server = require('../../../index');
        token = new User({
            userName: 'admin'
        }).generateAuthToken();
    });
    afterEach(async () => {
        server.close();
        await Sport.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all sports', async () => {
            await Sport.collection.insertMany([{
                    sportName: 'sport 1'
                },
                {
                    sportName: 'sport 2'
                }
            ]);

            const res = await request(server).get('/api/sports');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(sport => sport.sportName === 'sport 1')).toBeTruthy();
            expect(res.body.some(sport => sport.sportName === 'sport 2')).toBeTruthy();
        });
    });

    const execGetId = async (id) => {
        return await request(server)
            .get('/api/sports/' + id)
            .set('x-auth-token', token);
    }

    describe('GET /:id', () => {
        it('should return a sport if valid id is passed', async () => {
            const sport = new Sport({
                sportName: 'sport 1'
            });
            await sport.save();

            const res = await execGetId(sport._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('sportName', sport.sportName);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await execGetId(1);
            expect(res.status).toBe(404);
        });
        it('should return 404 if no sport with the given id exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await execGetId(id);
            expect(res.status).toBe(404);
        });
    });

    const execPost = async () => {
        return await request(server)
            .post('/api/sports/')
            .set('x-auth-token', token)
            .send(sportExec);
    }

    let sportExec = {};

    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await execPost();
            expect(res.status).toBe(401);
        });

        it('should return 400 if sportName is not given', async () => {
            const res = await execPost();
            expect(res.status).toBe(400);
        });

        it('should save the sport if it is valid', async () => {
            sportExec = {
                sportName: 'sport 1'
            };
            await execPost();
            const sport = await Sport.find({
                sportName: 'sport 1'
            });
            expect(sport).not.toBeNull();
        });

        it('should return the sport if it is valid', async () => {
            sportExec = {
                sportName: 'sport 1'
            };
            const res = await execPost();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('sportName', 'sport 1');
        });
    });

    const execPut = async (id) => {
        return await request(server)
            .put('/api/sports/' + id)
            .set('x-auth-token', token)
            .send(sportExec);
    }

    describe('PUT /', () => {
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await execPut(1);
            expect(res.status).toBe(401);
        });

        it('should return 400 if sportName is not given', async () => {
            sportExec = {
                sportName: 'sport 1'
            };
            await execPost();
            const sport = await Sport.find({
                sportName: 'sport 1'
            });
            sportExec = {};
            const res = await execPut(sport[0]._id);
            expect(res.status).toBe(400);
        });

        it('should return 404 if the sport with the given ID is not found', async () => {
            sportExec = {
                sportName: 'Sport 11'
            };
            const id = mongoose.Types.ObjectId();
            const res = await execPut(id);
            expect(res.status).toBe(404);
        });

        it('should save the sport if it is valid', async () => {
            sportExec = {
                sportName: 'sport 1'
            };
            await execPost();
            let sport = await Sport.find({
                sportName: 'sport 1'
            });
            sportExec = {
                sportName: 'sport 2'
            };
            await execPut(sport[0]._id);
            sport = await Sport.find({
                sportName: 'sport 2'
            });
            expect(sport).not.toBeNull();
        });

        it('should return the sport if it is valid', async () => {
            sportExec = {
                sportName: 'sport 1'
            };
            await execPost();
            let sport = await Sport.find({
                sportName: 'sport 1'
            });
            sportExec = {
                sportName: 'sport 2'
            };
            const res = await execPut(sport[0]._id);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('sportName', 'sport 2');
        });
    });

    const execDelete = async (id) => {
        return await request(server)
            .delete('/api/sports/' + id)
            .set('x-auth-token', token);
    }

    describe('DELETE /:id', () => {
        it('should return a sport if valid id is passed', async () => {
            const sport = new Sport({
                sportName: 'sport 1'
            });
            await sport.save();

            const res = await execDelete(sport._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('sportName', sport.sportName);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await execDelete(1);
            expect(res.status).toBe(404);
        });
        it('should return 404 if no sport with the given id exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await execDelete(id);
            expect(res.status).toBe(404);
        });
    });

    const execGetSportName = async (name) => {
        return await request(server)
            .get('/api/sports/sport/' + name)
            .set('x-auth-token', token);
    }

    describe('GET /sport/:sportName', () => {
        it('should return a sport if valid sportName is passed', async () => {
            const sport = new Sport({
                sportName: 'sport 1'
            });
            await sport.save();

            const res = await execGetSportName(sport.sportName);
            expect(res.status).toBe(200);
            expect(res.body.some(s => s.sportName === 'sport 1')).toBeTruthy();
        });
        it('should return 404 if no sport with the given sportName exist', async () => {
            const res = await execGetSportName('Sport');
            expect(res.status).toBe(404);
        });
    });
});