const mongoose = require('mongoose');

// Check the bookmaker ID
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.body.bookmaker_id)) {
        return res.status(404).send('Invalid bookmaker ID.');
    }
    next();
};