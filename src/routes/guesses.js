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

module.exports = router;