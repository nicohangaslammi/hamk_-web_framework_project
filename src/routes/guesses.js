const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Guess = require("../models/Guess");

// Delete a guess with given DrawRound id and number
// TODO: add socket id validation
router.delete('/', [
    body('round_id').exists(),
    body('number').isInt()
], async (req, res) => {
    const errors = validationResult(req);

    // Return if validation does not succeed
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.sendStatus(400);
    }

    try {
        // Try to delete given guess
        const response = await Guess.deleteOne({ draw_round: req.body.round_id, number: req.body.number }).exec();

        // Return 404 if guess was not deleted
        if (response.deletedCount !== 1) return res.sendStatus(404);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

// Create guess
router.post('/', async (req, res) => {
    try {
        const drawRoundId = req.body.draw_round;
        const number = req.body.number;
        // Check if number is taken
        const guess = await Guess.findOne({ 
            draw_round: drawRoundId,
            number: number
        });
        if (guess) {
            return res.status(400).send("Number is already taken");
        }
        // Create new guess
        const newGuess = new Guess({
            draw_round: drawRoundId,
            number: number,
            socket_id: "test"
        });
        await newGuess.save();
        res.status(200).send("Guess created!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
        msg: 'error'
        });
    }
});


module.exports = router;