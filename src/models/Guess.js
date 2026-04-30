const mongoose = require("mongoose");

const guessSchema = new mongoose.Schema({
    // ID of DrawRound the guess is put on
    draw_round: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DrawRound',
        required: true
    },
    // Which WebSocket connection made the guess
    socket_id: {
        type: String,
        required: true,
        index: true
    },
    // Guessed number
    number: {
        type: Number,
        required: true
    },
    // Timestamp of creation
    created_at: {
        type: Date,
        default: Date.now,
        // MongoDB deletes a guess automatically after 6 hours
        expires: 21600
    }
});

module.exports = mongoose.model('Guess', guessSchema);