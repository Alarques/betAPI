const mongoose = require('mongoose');

// Check the Sport ID
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.body.sport_id)) {
        return res.status(404).send('Invalid sport ID.');
    }
    next();
};