const validateObjectId = require('../middleware/validate/validateObjectId');
const validateUserId = require('../middleware/validate/validateUserId');
const validateBookmakerId = require('../middleware/validate/validateBookmakerId');
const {
    Bet,
    validate
} = require('../models/bet');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todas las apuestas de un usuario
 * * Busca a partir del id de un usuario
 * REVIEW Deberia filtrar por fecha para no sacar demasiados registros
 * 
 * @param id El ID del usuario
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const bets = await Bet.find({
        user_id: req.params.id
    }).sort('date');
    res.send(bets);
});

/**
 *  * Crea una apuesta
 * REVIEW Revisar la forma de obtener el id del usuario, pasarlo como un parametro? /:id
 */
router.post('/', [auth, validateUserId, validateBookmakerId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let bet = new Bet({
        date: req.body.date,
        bookmaker_id: req.body.bookmaker_id,
        sport: req.body.sport,
        selection: req.body.selection,
        betType: req.body.betType,
        tipster: req.body.tipster,
        liveBet: req.body.liveBet,
        score: req.body.score,
        stake: req.body.stake,
        odds: req.body.odds,
        freeBet: req.body.freeBet,
        win: req.body.win,
        atRisk: req.body.atRisk,
        potentialPayout: req.body.potentialPayout,
        payout: req.body.payout,
        profitLoss: req.body.profitLoss,
        notes: req.body.notes,
        user_id: req.body.user_id
    });
    bet = await bet.save();

    res.send(bet);
});

/**
 * * Actualiza una apuesta
 * 
 * @param id ID de la apuesta a actualizar
 */
router.put('/:id', [auth, validateObjectId, validateUserId, validateBookmakerId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const bet = await Bet.findByIdAndUpdate(req.params.id, {
        date: req.body.date,
        bookmaker_id: req.body.bookmaker_id,
        sportName: req.body.sport,
        selection: req.body.selection,
        betType: req.body.betType,
        tipster: req.body.tipster,
        liveBet: req.body.liveBet,
        score: req.body.score,
        stake: req.body.stake,
        odds: req.body.odds,
        freeBet: req.body.freeBet,
        win: req.body.win,
        atRisk: req.body.atRisk,
        potentialPayout: req.body.potentialPayout,
        payout: req.body.payout,
        profitLoss: req.body.profitLoss,
        notes: req.body.notes,
        user_id: req.body.user_id
    }, {
        new: true
    });

    if (!bet) return res.status(404).send('The bet with the given ID was not found.');

    res.send(bet);
});

/**
 * * Elimina una apuesta
 * 
 * @param id ID de la apuesta
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const bet = await Bet.findByIdAndRemove(req.params.id);

    if (!bet) return res.status(404).send('The bet with the given ID was not found.');

    res.send(bet);
});

/**
 * * Obtiene una apuesta
 * 
 * @param id ID de la apuesta 
 */
router.get('/bet/:id', [auth, validateObjectId], async (req, res) => {
    const bet = await Bet.findById(req.params.id);

    if (!bet) return res.status(404).send('The bet with the given ID was not found.');

    res.send(bet);
});

/**
 * * Obtiene las apuestas de una casa de apuestas
 * 
 * @param id ID de la casa de apuestas 
 */
router.get('/bookmaker/:id', validateObjectId, async (req, res) => {
    const bets = await Bet.find({
        bookmaker_id: req.params.id
    }).sort('date');

    if (!bets || bets.length === 0) return res.status(404).send('The bets with the given bookmaker was not found.');

    res.send(bets);
});

module.exports = router;