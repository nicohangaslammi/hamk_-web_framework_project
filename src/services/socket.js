const { Server } = require('socket.io');
const crypto = require('crypto');

// Map object for storing WebSocket connections paired with randomly generated tokens
const connections = new Map();

// Verify WebSocket by checking if connections map contains given key-value pair
const verifySocket = (socketId, token) => {
    // Return false if either of given parameters is undefined
    if (!socketId || !token) return false;

    return (connections.get(socketId) === token);
}

// Add WebSocket connection id and randomly generated token to connections map
const addSocketTokenPair = (socketId, token) => {
    connections.set(socketId, token);
};

// Remove WebSocket connection id and randomly generated token from connections map
const removeSocketTokenPair = (socketId) => {    
    connections.delete(socketId);
};

// Generate and return a randomized token using crypto library
const generateRandomizedToken = () => {
    return crypto.randomUUID();
};

// Start WebSocket server and start listening for messages
const initializeSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        // Log socket id connected
        console.log(socket.id);
        // Generate socket id
        const token = generateRandomizedToken();
        // Save socket id and token to Map
        addSocketTokenPair(socket.id, token);
        // Send token
        socket.emit('auth_token', token);

        socket.on('disconnect', () => {
        // Remove socket connection
        removeSocketTokenPair(socket.id);
        // Log disconnected socket id
        console.log(socket.id);
        });
    });
};

module.exports = { 
    initializeSocket,
    verifySocket 
};