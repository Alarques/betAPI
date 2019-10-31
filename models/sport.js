const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const sportSchema = new mongoose.Schema({
    sportName: {
        type: String,
        required: true,
        unique: true
    }
});

const Sport = mongoose.model('Sport', sportSchema);

function validateSport(sport) {
    const schema = Joi.object({
        sportName: Joi.string().required()
    });
    return schema.validate(sport);
}

exports.Sport = Sport;
exports.validate = validateSport;