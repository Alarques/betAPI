const mongoose = require('mongoose');
const Joi = require('joi');

const winTypeSchema = new mongoose.Schema({
    win: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 2
    },
    description: {
        type: String,
        required: true
    }
});

const WinType = mongoose.model('WinType', winTypeSchema);

function validateWinType(winType) {
    const schema = {
        win: Joi.string().min(1).max(2).required(),
        description: Joi.string().required()
    };
    return Joi.validate(winType, schema);
}

exports.WinType = WinType;
exports.validate = validateWinType;