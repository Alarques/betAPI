const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const depositSchema = new mongoose.Schema({
    bookmaker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookmaker'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    method: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    }
});

const Deposit = mongoose.model('Deposit', depositSchema);

function validateDeposit(deposit) {
    const schema = Joi.object({
        bookmaker_id: Joi.required(),
        user_id: Joi.required(),
        date: Joi.date(),
        method: Joi.string(),
        amount: Joi.number().required()
    });
    return schema.validate(deposit);
}

exports.Deposit = Deposit;
exports.validate = validateDeposit;