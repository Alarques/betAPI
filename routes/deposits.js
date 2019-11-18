const validateObjectId = require('../middleware/validate/validateObjectId');
const validateUserId = require('../middleware/validate/validateUserId');
const validateBookmakerId = require('../middleware/validate/validateBookmakerId');
const {
    Deposit,
    validate
} = require('../models/deposit');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Crea un ingreso en una casa de apuestas
 */
router.post('/', [auth, validateUserId, validateBookmakerId], async (req, res) => {
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
    deposit = await deposit.save();

    res.send(deposit);
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
    }).sort({date : -1});

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
    }).sort({date : -1});

    //if (!bookmakers || bookmakers.length === 0) return res.status(404).send('The bookmakers with the given user was not found.');

    res.send(deposits);
});

module.exports = router;