const validateObjectId = require('../middleware/validate/validateObjectId');
const validateUserId = require('../middleware/validate/validateUserId');
const {
    Tipster,
    validate
} = require('../models/tipster');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/**
 * * Obtiene todos los tipsters
 * REVIEW Deberia existir? Debolvera los tipsters de todos los usuarios
 */
router.get('/', async (req, res) => {
    const tipsters = await Tipster.find().sort('tipster');
    res.send(tipsters);
});

/**
 * * Crea un tipster
 */
router.post('/', [auth, validateUserId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let tipster = new Tipster({
        tipster: req.body.tipster,
        user_id: req.body.user_id
    });
    tipster = await tipster.save();

    res.send(tipster);
});

/**
 * * Actualiza un tipster
 * 
 * @param id ID del tipster
 */
router.put('/:id', [auth, validateObjectId, validateUserId], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tipster = await Tipster.findByIdAndUpdate(req.params.id, {
        tipster: req.body.tipster,
        user_id: req.body.user_id
    }, {
        new: true
    });

    if (!tipster) return res.status(404).send('The tipster with the given ID was not found.');

    res.send(tipster);
});

/**
 * * Elimina un tipster
 * 
 * @param id ID del tipster
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const tipster = await Tipster.findByIdAndRemove(req.params.id);

    if (!tipster) return res.status(404).send('The tipster with the given ID was not found.');

    res.send(tipster);
});

/**
 * * Obtiene un tipster según su ID
 * 
 * @param id ID del tipster
 */
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const tipster = await Tipster.findById(req.params.id);

    if (!tipster) return res.status(404).send('The tipster with the given ID was not found.');

    res.send(tipster);
});

/**
 * * Obtiene un tipster según su nombre
 * REVIEW Deberia existir? Obtendrá tipsters de otros usuarios ya que TRT puede estar en mas de un usuario
 * 
 * @param tipster Nombre del tipster
 */
router.get('/tipster/:tipster', async (req, res) => {
    const tipster = await Tipster.find({
        tipster: req.params.tipster
    });

    if (!tipster || tipster.length === 0) return res.status(404).send('The tipster with the given name was not found.');

    res.send(tipster);
});

/**
 * * Obtiene los tipsters de un usuario según su ID
 * 
 * @param id ID del usuario
 */
router.get('/user/:id', validateObjectId, async (req, res) => {
    const tipsters = await Tipster.find({
        user_id: req.params.id
    });

    if (!tipsters || tipsters.length === 0) return res.status(404).send('The tipsters with the given user was not found.');

    res.send(tipsters);
});

module.exports = router;