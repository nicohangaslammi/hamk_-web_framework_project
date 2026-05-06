const express = require('express');
const router = express.Router();

const DrawRound = require('../models/DrawRound');

router.post('/rounds', async (req,res) => {
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
        console.error(error);
        res.status(500).json({
            msg: 'error'
        });
    }
});

module.exports = router;