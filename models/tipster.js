const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const tipsterSchema = new mongoose.Schema({
    tipster: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Tipster = mongoose.model('Tipster', tipsterSchema);

function validateTipster(tipster) {
    const schema = Joi.object({
        tipster: Joi.string().required(),
        user_id: Joi.required()
    });
    return schema.validate(tipster);
}

exports.Tipster = Tipster;
exports.validate = validateTipster;