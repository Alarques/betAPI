const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const bookmakerSchema = new mongoose.Schema({
    bookmaker: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bank: {
        type: Number,
        default: 0
    },
    deposits: {
        type: Number,
        default: 0
    },
    withdrawals: {
        type: Number,
        default: 0
    },
    bonus:{
        type: Number,
        default: 0
    },
    wagers: {
        type: Number,
        default: 0
    },
    winnings: {
        type: Number,
        default: 0
    },
    netProfit: {
        type: Number,
        default: 0
    }
});

const Bookmaker = mongoose.model('Bookmaker', bookmakerSchema);

function validateBookmaker(bookmaker) {
    const schema = Joi.object({
        bookmaker: Joi.string().required(),
        user_id: Joi.required(),
        bank: Joi.number(),
        deposits: Joi.number(),
        withdrawals: Joi.number(),
        bonus: Joi.number(),
        wagers: Joi.number(),
        winnings: Joi.number(),
        netProfit: Joi.number()
    });
    return schema.validate(bookmaker);
}

exports.Bookmaker = Bookmaker;
exports.validate = validateBookmaker;
