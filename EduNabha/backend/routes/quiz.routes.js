const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('lesson', 'title');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('lesson', 'title');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit quiz answers
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    const { answers } = req.body;
    let score = 0;
    let totalPoints = 0;
    
    // Calculate score
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }
      totalPoints += question.points;
    });
    
    // Update user progress
    let userProgress = await UserProgress.findOne({ user: req.user.id });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        user: req.user.id,
        points: score,
        completedQuizzes: [quiz._id]
      });
    } else {
      // Add points
      userProgress.points += score;
      
      // Add to completed quizzes if not already there
      if (!userProgress.completedQuizzes.includes(quiz._id)) {
        userProgress.completedQuizzes.push(quiz._id);
      }
      
      // Update level based on points
      userProgress.level = Math.floor(userProgress.points / 100) + 1;
      
      // Update streak
      const lastActiveDate = new Date(userProgress.lastActive);
      const today = new Date();
      const diffTime = Math.abs(today - lastActiveDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        userProgress.streakDays += 1;
      } else {
        userProgress.streakDays = 1;
      }
      
      userProgress.lastActive = Date.now();
    }
    
    await userProgress.save();
    
    res.json({
      score,
      totalPoints,
      percentage: (score / totalPoints) * 100,
      userProgress: {
        points: userProgress.points,
        level: userProgress.level,
        streak: userProgress.streakDays
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new quiz (admin/teacher only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const quiz = new Quiz({
    title: req.body.title,
    description: req.body.description,
    lesson: req.body.lesson,
    questions: req.body.questions,
    difficulty: req.body.difficulty,
    timeLimit: req.body.timeLimit,
    pointsToEarn: req.body.pointsToEarn,
    language: req.body.language
  });

  try {
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;