const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const betTypeSchema = new mongoose.Schema({
    betType: {
        type: String,
        required: true
    },
    sport_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
    }
});

const BetType = mongoose.model('BetType', betTypeSchema);

function validateBetType(betType) {
    const schema = Joi.object({
        betType: Joi.string().required(),
        sport_id: Joi.required()
    });
    return schema.validate(betType);
}

exports.BetType = BetType;
exports.validate = validateBetType;