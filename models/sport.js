const mongoose = require('mongoose');
const Joi = require('joi');

const sportSchema = new mongoose.Schema({
    sportName: {
        type: String,
        required: true,
        unique: true
    }
});

const Sport = mongoose.model('Sport', sportSchema);

function validateSport(sport) {
    const schema = {
        sportName: Joi.string().required()
    };
    return Joi.validate(sport, schema);
}

exports.Sport = Sport;
exports.validate = validateSport;