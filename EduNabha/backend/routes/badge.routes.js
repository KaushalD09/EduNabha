const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

// Get all badges
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new badge (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const badge = new Badge({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    criteria: req.body.criteria,
    points: req.body.points
  });

  try {
    const newBadge = await badge.save();
    res.status(201).json(newBadge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;