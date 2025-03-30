const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    addVolunteer,
    getVolunteers,
    deleteVolunteer
} = require('../controllers/volunteerController');

// All routes below this middleware are protected and require NGO authentication
router.use(protect);
router.use(restrictTo('ngo'));

// Volunteer management routes
router.post('/add', addVolunteer);
router.get('/', getVolunteers);
router.delete('/:volunteerId', deleteVolunteer);

module.exports = router; 