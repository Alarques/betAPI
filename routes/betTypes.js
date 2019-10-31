const validateObjectId = require('../middleware/validate/validateObjectId');
const validateSportId = require('../middleware/validate/validateSportId');
const {
    BetType,
    validate
} = require('../models/betType');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todos los tipos de apuestas 
 * REVIEW Deberia existir para obtener todas?
 */
router.get('/', async (req, res) => {
    const betTypes = await BetType.find().sort('type');
    res.send(betTypes);
});

/**
 * * Crea un tipo de apuesta 
 */
router.post('/', [auth, validateSportId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let betType = new BetType({
        betType: req.body.betType,
        sport_id: req.body.sport_id
    });
    betType = await betType.save();

    res.send(betType);
});

/**
 * * Actualiza un tipo de apuesta
 * 
 * @param id ID del tipo de apuesta
 */
router.put('/:id', [auth, validateObjectId, validateSportId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const betType = await BetType.findByIdAndUpdate(req.params.id, {
        betType: req.body.betType,
        sport_id: req.body.sport_id
    }, {
        new: true
    });

    if (!betType) return res.status(404).send('The betType with the given ID was not found.');

    res.send(betType);
});

/**
 * * Elimina un tipo de apuesta
 * 
 * @param id ID del tipo de apuesta
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const betType = await BetType.findByIdAndRemove(req.params.id);

    if (!betType) return res.status(404).send('The betType with the given ID was not found.');

    res.send(betType);
});

/**
 * * Obtiene un tipo de apuesta según su ID
 * 
 * @param id ID de la apuesta
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const betType = await BetType.findById(req.params.id);

    if (!betType) return res.status(404).send('The betType with the given ID was not found.');

    res.send(betType);
});

/**
 * * Obtiene un tipo de apuesta según su nombre
 * 
 * @param betType Tipo de apuesta
 */
router.get('/betType/:betType', async (req, res) => {
    const betTypes = await BetType.find({
        betType: req.params.betType
    });

    if (!betTypes || betTypes.length === 0) return res.status(404).send('The betType with the given bet type was not found.');

    res.send(betTypes);
});

/**
 * * Obtiene los tipos de apuesta según el deporte
 * 
 * @param id ID del deporte
 */
router.get('/sport/:id', validateObjectId, async (req, res) => {
    const betTypes = await BetType.find({
        sport_id: req.params.id
    });

    if (!betTypes || betTypes.length === 0) return res.status(404).send('The betType with the given sport id was not found.');

    res.send(betTypes);
});

module.exports = router;