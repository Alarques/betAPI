const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
    const schema = Joi.object({
        win: Joi.string().min(1).max(2).required(),
        description: Joi.string().required()
    });
    return schema.validate(winType);
}

exports.WinType = WinType;
exports.validate = validateWinType;