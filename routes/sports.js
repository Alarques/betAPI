const validateObjectId = require('../middleware/validate/validateObjectId');
const {
    Sport,
    validate
} = require('../models/sport');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todos los deportes
 */
router.get('/', async (req, res) => {
    const sports = await Sport.find().sort('sportName');
    res.send(sports);
});

/**
 * * Crea un deporte
 */
router.post('/', auth, async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let sport = new Sport({
        sportName: req.body.sportName
    });
    sport = await sport.save();

    res.send(sport);
});

/**
 * * Actualiza un deporte
 * 
 * @param id ID del deporte
 */
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const sport = await Sport.findByIdAndUpdate(req.params.id, {
        sportName: req.body.sportName
    }, {
        new: true
    });

    if (!sport) return res.status(404).send('The sport with the given ID was not found.');

    res.send(sport);
});

/**
 * * Elimina un deporte
 * 
 * @param id ID del deporte
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const sport = await Sport.findByIdAndRemove(req.params.id);

    if (!sport) return res.status(404).send('The sport with the given ID was not found.');

    res.send(sport);
});

/**
 * * Obtiene un deporte según su ID
 * 
 * @param id ID del deporte
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const sport = await Sport.findById(req.params.id);

    if (!sport) return res.status(404).send('The sport with the given ID was not found.');

    res.send(sport);
});

/**
 * * Obtiene un deporte según su nombre
 * 
 * @param sportName Nombre del deporte
 */
router.get('/sport/:sportName', async (req, res) => {
    const sport = await Sport.find({
        sportName: req.params.sportName
    });

    if (!sport || sport.length === 0) return res.status(404).send('The sport with the given name was not found.');

    res.send(sport);
});

module.exports = router;