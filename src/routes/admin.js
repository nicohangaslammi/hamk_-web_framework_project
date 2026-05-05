const express = require('express');
const router = express.Router();

const authentication = require('../middleware/authentication');
const DrawRound = require('../models/DrawRound');

router.post('/rounds', authentication, async (req,res) => {
    try {
        const activeRound = await DrawRound.findOne({ status: 'auki' });
        if (activeRound) {
            return res.send("Draw is already running!");
        }
        const newRound = new DrawRound({
            status: 'auki',
            draw_time: new Date()
        });
        await newRound.save();
        res.send("Draw created!");
        }
    catch (error) {
        res.status(500).json({
            msg: 'error'
        });
    }
});

module.exports = router;