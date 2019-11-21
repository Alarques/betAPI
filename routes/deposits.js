const validateObjectId = require('../middleware/validate/validateObjectId');
const validateUserId = require('../middleware/validate/validateUserId');
const validateBookmakerId = require('../middleware/validate/validateBookmakerId');
const {
    Deposit,
    validate
} = require('../models/deposit');
const Bookmaker = require('../models/bookmaker');
const User = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Crea un ingreso en una casa de apuestas
 */
router.post('/', [auth, validateUserId, validateBookmakerId], async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let deposit = new Deposit({
            bookmaker_id: req.body.bookmaker_id,
            user_id: req.body.user_id,
            date: req.body.date,
            method: req.body.method,
            amount: req.body.amount
        });
        await Deposit.insertOne({
            bookmaker_id: deposit.bookmaker_id,
            user_id: deposit.user_id,
            date: deposit.date,
            method: deposit.method,
            amount: deposit.amount
        }, {session});

        /*let bookmaker = await Bookmaker.findById(deposit.bookmaker_id, options);
        bookmaker.bank = bookmaker.bank + deposit.amount
        bookmaker.deposits = bookmaker.deposits + deposit.amount
        bookmaker = await Bookmaker.findByIdAndUpdate(bookmaker._id, bookmaker, options);

        let user = await User.findById(deposit.user_id).select('-password');
        user.bank = user.bank + deposit.amount
        user = await User.findByIdAndUpdate(user._id, user, options);*/
        
        await session.commitTransaction();
        session.endSession();
        
        res.send(deposit);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).send(error.details[0]);
    }
});

/**
 * * Actualiza un ingreso
 * 
 * @param id ID del ingreso
 */
router.put('/:id', [auth, validateObjectId, validateUserId, validateBookmakerId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const deposit = await Deposit.findByIdAndUpdate(req.params.id, {
        bookmaker: req.body.bookmaker_id,
        user_id: req.body.user_id,
        date: req.body.date,
        method: req.body.method,
        amount: req.body.amount
    }, {
        new: true
    });

    if (!deposit) return res.status(404).send('The deposit with the given ID was not found.');

    res.send(deposit);
});

/**
 * * Elimina un ingreso
 * 
 * @param id ID del ingreso
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const deposit = await Deposit.findByIdAndRemove(req.params.id);

    if (!deposit) return res.status(404).send('The deposit with the given ID was not found.');

    res.send(deposit);
});

/**
 * * Obtiene un ingreso según su ID
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) return res.status(404).send('The deposit with the given ID was not found.');

    res.send(deposit);
});

/**
 * * Obtiene los ingresos de un usuario según su ID
 * 
 * @param id ID del usuario
 */
router.get('/user/:id', validateObjectId, async (req, res) => {
    const deposits = await Deposit.find({
        user_id: req.params.id
    }).sort({
        date: -1
    });

    //if (!bookmakers || bookmakers.length === 0) return res.status(404).send('The bookmakers with the given user was not found.');

    res.send(deposits);
});

/**
 * * Obtiene los ingresos de una uan casa de apuestas según su ID
 * 
 * @param id ID de la casa de apuestas
 */
router.get('/bookmaker/:id', validateObjectId, async (req, res) => {
    const deposits = await Deposit.find({
        bookmaker_id: req.params.id
    }).sort({
        date: -1
    });

    //if (!bookmakers || bookmakers.length === 0) return res.status(404).send('The bookmakers with the given user was not found.');

    res.send(deposits);
});

module.exports = router;
