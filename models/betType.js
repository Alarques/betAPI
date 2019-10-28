const mongoose = require('mongoose');
const Joi = require('joi');

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
    const schema = {
        betType: Joi.string().required(),
        sport_id: Joi.required()
    };
    return Joi.validate(betType, schema);
}

exports.BetType = BetType;
exports.validate = validateBetType;