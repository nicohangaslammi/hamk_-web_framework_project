const express = require('express');
const router = express.Router();

const DrawRound = require('../models/DrawRound');
const Guess = require('../models/Guess');

// Get active draw round
router.get('/', async (req,res) => {
    try {
        // Find active round and return 404 if round was not found
        const activeRound = await DrawRound.findOne({ status: "auki" })
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

module.exports = router;