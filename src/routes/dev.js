const express = require('express');
const router = express.Router();

const DrawRound = require('../models/DrawRound');
const Guess = require("../models/Guess");

// Create dummy guesses with random numbers. Does not check if number is available
router.post('/add_dummy_guesses_to_active_round/:amount', async (req, res) => {
    const amount = req.params.amount;

    try {
        // Find active round and return 404 if round was not found
        const activeRound = await DrawRound.findOne({ status: 'auki' }).exec();
        if (!activeRound) return res.sendStatus(404);

        // Create array of dummy guesses with
        const dummyGuesses = [];

        for (let i = 0; i < amount; i++) {
            const guess = {
                draw_round: activeRound._id,
                socket_id: 'dummy',
                number: Math.floor(Math.random() * 100) + 1
            }

            dummyGuesses.push(guess);
        }

        const result = await Guess.insertMany(dummyGuesses);

        console.log(`added ${amount} dummy guesses`);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = router;