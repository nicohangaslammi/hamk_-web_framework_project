const { Server } = require('socket.io');
const crypto = require('crypto');

// Map object for storing WebSocket connections paired with randomly generated tokens
const connections = new Map();

let io;

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
    io = new Server(server);

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

// Emit Websocket message to every client excluding who made the guess of guess addition
const broadcastGuessAddition = (roundId, socketId, number) => {
    // Get WebSocket with given id
    const socket = io.sockets.sockets.get(socketId)

    if (!socket) return;

    guessData = {
        "roundId": roundId,
        "socketId": socketId,
        "number": number
    };

    socket.broadcast.emit("guess_addition", guessData);
}

// Emit Websocket message to every client excluding who made the guess of guess removal
const broadcastGuessRemoval = (roundId, socketId, number) => {
    // Get WebSocket with given id
    const socket = io.sockets.sockets.get(socketId)

    if (!socket) return;

    guessData = {
        "roundId": roundId,
        "number": number
    };

    socket.broadcast.emit("guess_addition", guessData);
};

// Emit Websocket message to every client when draw round is open
const broadcastDrawOpen = (roundId, status) => {
    // Return if socket.io is not initialized
    if (!io) return; 
    // Create message object for event
    const drawOpenMessage = {
        "roundId": roundId,
        "status": status
    };
    // Send event to every client connected
    io.emit("draw_open", drawOpenMessage);
}

// Emit Websocket message to every client when draw round is completed
const broadcastDrawCompleted = (roundId, winningNumber, winningSocketId) => {
    // Return if socket.io is not initialized
    if (!io) return; 
    // Create message object for event
    const drawCompletedMessage = {
        "winningNumber": winningNumber,
        "winningSocketId": winningSocketId
    };
    // Send event to every client connected
    io.emit("draw_completed", drawCompletedMessage);
}


module.exports = { 
    initializeSocket,
    verifySocket,
    broadcastGuessAddition,
    broadcastGuessRemoval,
    broadcastDrawOpen,
    broadcastDrawCompleted
};