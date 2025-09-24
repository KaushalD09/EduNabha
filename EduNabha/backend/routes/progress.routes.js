const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const UserProgress = require('../models/UserProgress');

// Get user progress
router.get('/user', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('lesson', 'title category')
      .sort({ lastAccessed: -1 });
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's gamification progress
router.get('/gamification', auth, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ user: req.user.id })
      .populate('badges', 'name description imageUrl')
      .populate('completedLessons', 'title')
      .populate('completedQuizzes', 'title');
    
    if (!userProgress) {
      userProgress = new UserProgress({
        user: req.user.id
      });
      await userProgress.save();
    }
    
    res.json(userProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await UserProgress.find()
      .sort({ points: -1 })
      .limit(10)
      .populate('user', 'name');
    
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update or create progress
router.post('/', auth, async (req, res) => {
  try {
    const { lessonId, completed, score } = req.body;
    
    // Find if progress already exists
    let progress = await Progress.findOne({ 
      user: req.user.id,
      lesson: lessonId
    });
    
    if (progress) {
      // Update existing progress
      progress.completed = completed !== undefined ? completed : progress.completed;
      progress.score = score !== undefined ? score : progress.score;
      progress.lastAccessed = Date.now();
    } else {
      // Create new progress
      progress = new Progress({
        user: req.user.id,
        lesson: lessonId,
        completed: completed || false,
        score: score || 0
      });
    }
    
    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;