const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Get user's shortlist
router.get('/', authenticateToken, async (req, res) => {
    try {
        const shortlists = await getAll(
            `SELECT l.* FROM lawyers l
             INNER JOIN shortlists s ON l.id = s.lawyer_id
             WHERE s.user_id = ?
             ORDER BY s.created_at DESC`,
            [req.user.id]
        );

        const formattedLawyers = shortlists.map(lawyer => ({
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

        res.json({ shortlist: formattedLawyers });
    } catch (error) {
        console.error('Get shortlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add lawyer to shortlist
router.post('/:lawyerId', authenticateToken, async (req, res) => {
    try {
        const lawyerId = req.params.lawyerId;

        // Check if lawyer exists
        const lawyer = await getOne('SELECT * FROM lawyers WHERE id = ?', [lawyerId]);
        if (!lawyer) {
            return res.status(404).json({ error: 'Lawyer not found' });
        }

        // Check if already in shortlist
        const existing = await getOne(
            'SELECT * FROM shortlists WHERE user_id = ? AND lawyer_id = ?',
            [req.user.id, lawyerId]
        );

        if (existing) {
            return res.status(400).json({ error: 'Lawyer already in shortlist' });
        }

        await runQuery(
            'INSERT INTO shortlists (user_id, lawyer_id) VALUES (?, ?)',
            [req.user.id, lawyerId]
        );

        res.status(201).json({ message: 'Lawyer added to shortlist' });
    } catch (error) {
        console.error('Add to shortlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove lawyer from shortlist
router.delete('/:lawyerId', authenticateToken, async (req, res) => {
    try {
        const result = await runQuery(
            'DELETE FROM shortlists WHERE user_id = ? AND lawyer_id = ?',
            [req.user.id, req.params.lawyerId]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Lawyer not found in shortlist' });
        }

        res.json({ message: 'Lawyer removed from shortlist' });
    } catch (error) {
        console.error('Remove from shortlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

