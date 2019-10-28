const mongoose = require('mongoose');

// Check the user ID
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
        return res.status(404).send('Invalid user ID.');
    }
    next();
};