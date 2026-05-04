const mongoose = require('mongoose');

const drawRoundSchema = new mongoose.Schema ({
    // Status of the draw
    status: {
        type: String,
        enum: ['auki', 'suljettu'],
        required: true
    },
    // Winning number
    winning_number: {
        type: Number,
        default: null
    },
    // Creation time
    created_at: {
        type: Date,
        default: Date.now
    },
    // Draw time
    draw_time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("DrawRound", drawRoundSchema);