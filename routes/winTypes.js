const validateObjectId = require('../middleware/validate/validateObjectId');
const {
    WinType,
    validate
} = require('../models/winType');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todos los tipos de resultados de las apuestas (Perdida, Ganada....)
 */
router.get('/', async (req, res) => {
    const winTypes = await WinType.find().sort('win');
    res.send(winTypes);
});

/**
 * * Crea un tipo de resultado
 */
router.post('/', auth, async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let winType = new WinType({
        win: req.body.win,
        description: req.body.description
    });
    winType = await winType.save();

    res.send(winType);
});

/**
 * * Actualiza un tipo de resultado
 * 
 * @param id ID del tipo de resultado
 */
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const winType = await WinType.findByIdAndUpdate(req.params.id, {
        win: req.body.win,
        description: req.body.description
    }, {
        new: true
    });

    if (!winType) return res.status(404).send('The winType with the given ID was not found.');

    res.send(winType);
});

/**
 * * Elimina un tipo de resultado
 * 
 * @param id ID del tipo de resultado
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const winType = await WinType.findByIdAndRemove(req.params.id);

    if (!winType) return res.status(404).send('The winType with the given ID was not found.');

    res.send(winType);
});

/**
 * * Obtiene un tipo de resultado según su ID
 * 
 * @param id ID del tipo de resultado
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const winType = await WinType.findById(req.params.id);

    if (!winType) return res.status(404).send('The winType with the given ID was not found.');

    res.send(winType);
});

/**
 * * Obtiene un tipo de resultado según su nombre
 * 
 * @param win Código del resultado
 */
router.get('/winType/:win', async (req, res) => {
    const winType = await WinType.find({
        win: req.params.win
    });

    if (!winType || winType.length === 0) return res.status(404).send('The winType with the given name was not found.');

    res.send(winType);
});

module.exports = router;