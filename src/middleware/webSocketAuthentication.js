const { verifySocket } = require('../services/socket.js');

// WebSocket authentication middleware
const webSocketAuthentication = (req, res, next) => {
    // Get socket id
    const socketId = req.headers['x-socket-id'];
    // Get authorization header
    const authorization = req.headers.authorization;
    // Remove Bearer from token
    const token = authorization.split(" ")[1];
    // Verify socket id and token
    const isValid = verifySocket(socketId, token);
    // Return 401 if not verified
    if (!isValid) {
        return res.sendStatus(401);
    }
    // Save socket id to request
    req.socketId = socketId;
    next();
};

module.exports = webSocketAuthentication;
