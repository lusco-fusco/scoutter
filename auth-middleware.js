'user strict';

require('dotenv').config();

function checkXApiKey (req, res, next) {
    key = req.header('x-api-key');
    
    if (key === process.env.X_API_KEY) {
        // keep executing the router middleware
        next();
    } else {
        res.status(401).send('forbidden');
    }
}

module.exports = checkXApiKey;