// WebSocket functions

// Map object for storing WebSocket connections paired with randomly generated tokens
const connections = new Map();

// Verify WebSocket by checking if connections map contains given key-value pair
const verifySocket = (socketId, token) => {
    // Return false if either of given parameters is undefined
    if (!socketId || !token) return false;

    return (connections.get(socketId) === token);
}

module.exports = { verifySocket };