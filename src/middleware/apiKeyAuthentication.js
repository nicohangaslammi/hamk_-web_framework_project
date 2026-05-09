const API_KEY = process.env.API_KEY;
console.log(API_KEY);

// API key authentication middleware
const apiKeyAuthentication = (req, res, next) => {
    const userKey = req.header('x-api-key');

    // Return if no API key was given
    if (!userKey) return res.sendStatus(401);

    // Return if keys don't match
    if (userKey !== API_KEY) {
        return res.sendStatus(401);
    }

    next();
}

module.exports = apiKeyAuthentication;