const express = require('express');
const router = express.Router();
const { getAll, getOne, runQuery } = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all lawyers with optional filters
router.get('/', async (req, res) => {
    try {
        const {
            practiceArea,
            state,
            minExperience,
            maxRate,
            responseGuarantee,
            sortBy = 'id'
        } = req.query;

        let query = 'SELECT * FROM lawyers WHERE 1=1';
        const params = [];

        if (practiceArea) {
            query += ' AND practice_area = ?';
            params.push(practiceArea);
        }

        if (state) {
            query += ' AND location_state = ?';
            params.push(state);
        }

        if (minExperience) {
            query += ' AND experience_years >= ?';
            params.push(parseInt(minExperience));
        }

        if (maxRate) {
            query += ' AND hourly_rate_min <= ?';
            params.push(parseFloat(maxRate));
        }

        if (responseGuarantee === 'true') {
            query += ' AND response_guarantee = 1';
        }

        // Sorting
        const validSorts = ['id', 'experience_years', 'hourly_rate_min', 'success_rate'];
        const sortField = validSorts.includes(sortBy) ? sortBy : 'id';
        query += ` ORDER BY ${sortField} DESC`;

        const lawyers = await getAll(query, params);

        // Parse specialties JSON
        const formattedLawyers = lawyers.map(lawyer => ({
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

        res.json({ lawyers: formattedLawyers });
    } catch (error) {
        console.error('Get lawyers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single lawyer by ID
router.get('/:id', async (req, res) => {
    try {
        const lawyer = await getOne('SELECT * FROM lawyers WHERE id = ?', [req.params.id]);

        if (!lawyer) {
            return res.status(404).json({ error: 'Lawyer not found' });
        }

        const formattedLawyer = {
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
        };

        res.json({ lawyer: formattedLawyer });
    } catch (error) {
        console.error('Get lawyer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new lawyer (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            firm,
            tier = 'mid',
            practiceArea,
            specialties = [],
            experienceYears,
            caseCount = 0,
            successRate = 75,
            hourlyRateMin,
            hourlyRateMax,
            locationCity,
            locationState,
            verified = false,
            mediationCertified = false,
            responseGuarantee = false,
            maraNumber,
            bio,
            avatarColor
        } = req.body;

        if (!name || !firm || !practiceArea || !experienceYears || !hourlyRateMin || !hourlyRateMax || !locationCity || !locationState) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await runQuery(
            `INSERT INTO lawyers (
                name, firm, tier, practice_area, specialties, experience_years,
                case_count, success_rate, hourly_rate_min, hourly_rate_max,
                location_city, location_state, verified, mediation_certified,
                response_guarantee, mara_number, bio, avatar_color
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, firm, tier, practiceArea, JSON.stringify(specialties),
                experienceYears, caseCount, successRate, hourlyRateMin, hourlyRateMax,
                locationCity, locationState, verified ? 1 : 0, mediationCertified ? 1 : 0,
                responseGuarantee ? 1 : 0, maraNumber || null, bio || null,
                avatarColor || '#' + Math.floor(Math.random() * 16777215).toString(16)
            ]
        );

        const lawyer = await getOne('SELECT * FROM lawyers WHERE id = ?', [result.lastID]);

        res.status(201).json({
            message: 'Lawyer created successfully',
            lawyer: {
                ...lawyer,
                specialties: lawyer.specialties ? JSON.parse(lawyer.specialties) : []
            }
        });
    } catch (error) {
        console.error('Create lawyer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update lawyer (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const lawyerId = req.params.id;
        const updates = req.body;

        // Build dynamic update query
        const allowedFields = [
            'name', 'firm', 'tier', 'practice_area', 'specialties', 'experience_years',
            'case_count', 'success_rate', 'hourly_rate_min', 'hourly_rate_max',
            'location_city', 'location_state', 'verified', 'mediation_certified',
            'response_guarantee', 'mara_number', 'bio', 'avatar_color'
        ];

        const updateFields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (allowedFields.includes(dbKey)) {
                if (key === 'specialties' && Array.isArray(value)) {
                    updateFields.push(`${dbKey} = ?`);
                    values.push(JSON.stringify(value));
                } else if (key === 'verified' || key === 'mediationCertified' || key === 'responseGuarantee') {
                    updateFields.push(`${dbKey} = ?`);
                    values.push(value ? 1 : 0);
                } else {
                    updateFields.push(`${dbKey} = ?`);
                    values.push(value);
                }
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        values.push(lawyerId);
        const query = `UPDATE lawyers SET ${updateFields.join(', ')} WHERE id = ?`;

        await runQuery(query, values);

        const updatedLawyer = await getOne('SELECT * FROM lawyers WHERE id = ?', [lawyerId]);

        res.json({
            message: 'Lawyer updated successfully',
            lawyer: updatedLawyer
        });
    } catch (error) {
        console.error('Update lawyer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete lawyer (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await runQuery('DELETE FROM lawyers WHERE id = ?', [req.params.id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Lawyer not found' });
        }

        res.json({ message: 'Lawyer deleted successfully' });
    } catch (error) {
        console.error('Delete lawyer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

