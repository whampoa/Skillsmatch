const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Get user's comparison list
router.get('/', authenticateToken, async (req, res) => {
    try {
        const comparisons = await getAll(
            `SELECT l.* FROM lawyers l
             INNER JOIN comparisons c ON l.id = c.lawyer_id
             WHERE c.user_id = ?
             ORDER BY c.created_at DESC
             LIMIT 3`,
            [req.user.id]
        );

        const formattedLawyers = comparisons.map(lawyer => ({
            ...lawyer,
            specialties: lawyer.specialties ? JSON.parse(lawyer.specialties) : [],
            verified: Boolean(lawyer.verified),
            mediationCertified: Boolean(lawyer.mediation_certified),
            responseGuarantee: Boolean(lawyer.response_guarantee),
            practiceArea: lawyer.practice_area,
            experienceYears: lawyer.experience_years,
            caseCount: lawyer.case_count,
            successRate: lawyer.success_rate,
            hourlyRateMin: lawyer.hourly_rate_min,
            hourlyRateMax: lawyer.hourly_rate_max,
            locationCity: lawyer.location_city,
            locationState: lawyer.location_state,
            maraNumber: lawyer.mara_number,
            avatarColor: lawyer.avatar_color
        }));

        res.json({ comparison: formattedLawyers });
    } catch (error) {
        console.error('Get comparison error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add lawyer to comparison
router.post('/:lawyerId', authenticateToken, async (req, res) => {
    try {
        const lawyerId = req.params.lawyerId;

        // Check current count
        const currentCount = await getAll(
            'SELECT COUNT(*) as count FROM comparisons WHERE user_id = ?',
            [req.user.id]
        );

        if (currentCount[0].count >= 3) {
            return res.status(400).json({ error: 'Maximum 3 lawyers can be compared' });
        }

        // Check if lawyer exists
        const lawyer = await getOne('SELECT * FROM lawyers WHERE id = ?', [lawyerId]);
        if (!lawyer) {
            return res.status(404).json({ error: 'Lawyer not found' });
        }

        // Check if already in comparison
        const existing = await getOne(
            'SELECT * FROM comparisons WHERE user_id = ? AND lawyer_id = ?',
            [req.user.id, lawyerId]
        );

        if (existing) {
            return res.status(400).json({ error: 'Lawyer already in comparison' });
        }

        await runQuery(
            'INSERT INTO comparisons (user_id, lawyer_id) VALUES (?, ?)',
            [req.user.id, lawyerId]
        );

        res.status(201).json({ message: 'Lawyer added to comparison' });
    } catch (error) {
        console.error('Add to comparison error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove lawyer from comparison
router.delete('/:lawyerId', authenticateToken, async (req, res) => {
    try {
        const result = await runQuery(
            'DELETE FROM comparisons WHERE user_id = ? AND lawyer_id = ?',
            [req.user.id, req.params.lawyerId]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Lawyer not found in comparison' });
        }

        res.json({ message: 'Lawyer removed from comparison' });
    } catch (error) {
        console.error('Remove from comparison error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Clear all comparisons
router.delete('/', authenticateToken, async (req, res) => {
    try {
        await runQuery('DELETE FROM comparisons WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Comparison cleared' });
    } catch (error) {
        console.error('Clear comparison error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

