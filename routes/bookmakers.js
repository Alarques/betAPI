const validateObjectId = require('../middleware/validate/validateObjectId');
const validateUserId = require('../middleware/validate/validateUserId');
const {
    Bookmaker,
    validate
} = require('../models/bookmaker');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todas las casas de apuestas
 * REVIEW Deberia existir? solo obtener por usuario?
 */
router.get('/', async (req, res) => {
    const bookmakers = await Bookmaker.find().sort('bank');
    res.send(bookmakers);
});

/**
 * * Crea una casa de apuestas
 */
router.post('/', [auth, validateUserId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let bookmaker = new Bookmaker({
        bookmaker: req.body.bookmaker,
        user_id: req.body.user_id,
        bank: req.body.bank,
        deposits: req.body.deposits,
        withdrawals: req.body.withdrawals,
        bonus: req.body.bonus,
        wagers: req.body.wagers,
        winnings: req.body.winnings,
        netProfit: req.body.netProfit
    });
    bookmaker = await bookmaker.save();

    res.send(bookmaker);
});

/**
 * * Actualiza una casa de apuestas
 * 
 * @param id ID de la casa de apuestas
 */
router.put('/:id', [auth, validateObjectId, validateUserId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const bookmaker = await Bookmaker.findByIdAndUpdate(req.params.id, {
        bookmaker: req.body.bookmaker,
        user_id: req.body.user_id,
        bank: req.body.bank,
        deposits: req.body.deposits,
        withdrawals: req.body.withdrawals,
        bonus: req.body.bonus,
        wagers: req.body.wagers,
        winnings: req.body.winnings,
        netProfit: req.body.netProfit
    }, {
        new: true
    });

    if (!bookmaker) return res.status(404).send('The bookmaker with the given ID was not found.');

    res.send(bookmaker);
});

/**
 * * Elimina una casa de apuestas
 * 
 * @param id ID de la casa de apuestas
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const bookmaker = await Bookmaker.findByIdAndRemove(req.params.id);

    if (!bookmaker) return res.status(404).send('The bookmaker with the given ID was not found.');

    res.send(bookmaker);
});

/**
 * * Obtiene una casa de apuestas según su ID
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const bookmaker = await Bookmaker.findById(req.params.id);

    if (!bookmaker) return res.status(404).send('The bookmaker with the given ID was not found.');

    res.send(bookmaker);
});

/**
 * * Obtiene una casa de apuestas según su nombre
 * REVIEW Deberia existir? Puede obtener mas de una porque bet365 puede estar en varios usuarios
 * 
 * @param bookmaker Nombre de la casa de apuestas
 */
router.get('/bookmaker/:bookmaker', async (req, res) => {
    const bookmaker = await Bookmaker.find({
        bookmaker: req.params.bookmaker
    });

    if (!bookmaker || bookmaker.length === 0) return res.status(404).send('The bookmaker with the given name was not found.');

    res.send(bookmaker);
});

/**
 * * Obtiene las casas de apuestas de un usuario según su ID
 * 
 * @param id ID del usuario
 */
router.get('/user/:id', validateObjectId, async (req, res) => {
    const bookmakers = await Bookmaker.find({
        user_id: req.params.id
    }).sort('bank : 1');

    //if (!bookmakers || bookmakers.length === 0) return res.status(404).send('The bookmakers with the given user was not found.');

    res.send(bookmakers);
});

module.exports = router;
