const mongoose = require('mongoose');
const Joi = require('joi');

const ObjectId = mongoose.Types.ObjectId;

const betSchema = new mongoose.Schema({
    date: { 
        type: Date,
        default: Date.now
    },
    bookmaker_id: {
        type: ObjectId,
        ref: 'Bookmaker'
    },
    sport: {
        type: String,
        required: true
    },
    selection: {
        type: String,
        maxlength: 50
    },
    betType: {
        type: String
    },
    tipster: {
        type: String
    },
    liveBet: {
        type: Boolean,
        default: false
    },
    score: {
        type: String,
        maxlength: 20
    },
    stake: {
        type: Number,
        required: true
    },
    odds: {
        type: Number,
        required: true
    },
    freeBet: {
        type: Boolean,
        default: false
    },
    win: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2,
        default: 'N'
    },
    atRisk: {
        type: Number,
        default: 0
    },
    potentialPayout: {
        type: Number,
        default: 0
    },
    payout: {
        type: Number,
        default: 0
    },
    profitLoss: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        maxlength: 255
    },
    user_id: {
        type: ObjectId,
        ref: 'User'
    }
});

const Bet = mongoose.model('Bet', betSchema);

function validateBet(bet) {
    const schema = {
        date: Joi.date(),
        bookmaker_id: Joi.required(),
        sport: Joi.string().required(),
        selection: Joi.string().max(50),
        betType: Joi.string(),
        tipster: Joi.string(),
        liveBet: Joi.boolean(),
        score: Joi.string().allow('', null).max(20),
        stake: Joi.number().required(),
        odds: Joi.number().required(),
        freeBet: Joi.boolean(),
        win: Joi.string().required().min(1).max(2),
        atRisk: Joi.number(),
        potentialPayout: Joi.number(),
        payout: Joi.number(),
        profitLoss: Joi.number(),
        notes: Joi.string().allow('', null).max(255),
        user_id: Joi.required()
    };
    return Joi.validate(bet, schema);
}

exports.Bet = Bet;
exports.validate = validateBet;