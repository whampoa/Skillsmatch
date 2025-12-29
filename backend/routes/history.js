const express = require('express');
const router = express.Router();
const { getAll, runQuery } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Get user's search history
router.get('/', authenticateToken, async (req, res) => {
    try {
        const history = await getAll(
            `SELECT * FROM search_history 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 50`,
            [req.user.id]
        );

        const formattedHistory = history.map(item => ({
            ...item,
            practiceArea: item.practice_area,
            minExperience: item.min_experience,
            maxRate: item.max_rate,
            responseGuarantee: Boolean(item.response_guarantee),
            resultCount: item.result_count,
            createdAt: item.created_at
        }));

        res.json({ history: formattedHistory });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save search to history
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            practiceArea,
            state,
            minExperience,
            maxRate,
            responseGuarantee,
            resultCount
        } = req.body;

        await runQuery(
            `INSERT INTO search_history 
             (user_id, practice_area, state, min_experience, max_rate, response_guarantee, result_count)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                practiceArea || null,
                state || null,
                minExperience || null,
                maxRate || null,
                responseGuarantee ? 1 : 0,
                resultCount || 0
            ]
        );

        res.status(201).json({ message: 'Search saved to history' });
    } catch (error) {
        console.error('Save history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

