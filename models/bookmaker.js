const mongoose = require('mongoose');
const Joi = require('joi');

const bookmakerSchema = new mongoose.Schema({
    bookmaker: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bank: {
        type: Number,
        default: 0
    }
});

const Bookmaker = mongoose.model('Bookmaker', bookmakerSchema);

function validateBookmaker(bookmaker) {
    const schema = {
        bookmaker: Joi.string().required(),
        user_id: Joi.required(),
        bank: Joi.number()
    };
    return Joi.validate(bookmaker, schema);
}

exports.Bookmaker = Bookmaker;
exports.validate = validateBookmaker;