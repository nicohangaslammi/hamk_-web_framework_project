const express = require('express');
const router = express.Router();

// Middleware
const apiKeyAuthentication = require("../middleware/apiKeyAuthentication");

// Models
const DrawRound = require('../models/DrawRound');
const Guess = require('../models/Guess');

// Socket
const { broadcastDrawOpen } = require('../services/socket');
const { broadcastDrawComplete } = require('../services/socket');

// Placeholder static amount of guess numbers in a draw round
const ROUND_GUESS_NUMBER_COUNT = 20;

// Create an active draw round as admin
router.post('/', apiKeyAuthentication, async (req,res) => {
    try {
        const activeRound = await DrawRound.findOne({ status: 'open' });
        if (activeRound) {
            return res.status(400).send("Draw is already running!");
        }
        const newRound = new DrawRound({
            status: 'auki',
            draw_time: new Date()
        });
        await newRound.save();
        // Broadcast a websocket message to clients
        broadcastDrawOpen(newRound._id, newRound.status);
        res.send("Draw created!");
        }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'error'
        });
    }
});

// Get active draw round
router.get('/', async (req,res) => {
    try {
        // Find active round and return 404 if round was not found
        const activeRound = await DrawRound.findOne({ status: "open" })
            .select("status created_at")
            .lean()
            .exec();

        if (!activeRound) return res.sendStatus(404);

        // Get every guess made for active round
        const guesses = await Guess.find({ draw_round: activeRound._id })
            .select('-_id socket_id number')
            .exec();

        // Add array of guesses to response
        activeRound.guesses = guesses;
        res.status(200).send(activeRound);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Start draw as admin
router.patch('/', apiKeyAuthentication, async (req,res) => {
    try {
        const round = await DrawRound.findOne({ status: 'open' });
        if (!round) {
            return res.sendStatus(404);
        }
        // Random winning number 
        let winningNumber = Math.floor((Math.random() * ROUND_GUESS_NUMBER_COUNT) + 1);
        round.winning_number = winningNumber;
        // Draw execution date
        round.draw_time = new Date();
        // Close draw
        round.status = 'closed';
        await round.save();

        // Get round id
        const roundId = round._id;
        // Find winning guess
        const winningGuess = await Guess.findOne({
            draw_round: roundId,
            number: winningNumber
        });
        // Get winning socket id
        let winningSocketId = null;
        // Check if winning guess exists
        if (winningGuess) {
            // Save winning socket id
            winningSocketId = winningGuess.socket_id; 
        }
        // Broadcast completed draw to clients
        broadcastDrawComplete(roundId, winningNumber, winningSocketId);
        res.send("Draw completed!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'error'
        });
    }
});

module.exports = router;