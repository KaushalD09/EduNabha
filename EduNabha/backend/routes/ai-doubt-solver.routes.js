const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Simple AI doubt solver endpoint
router.post('/', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        // In a real implementation, this would call an AI service
        // For now, we'll use a simple keyword-based response system
        const response = generateAIResponse(question);
        
        return res.status(200).json({ response });
    } catch (error) {
        console.error('AI doubt solver error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Generate a response based on keywords in the question
function generateAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Math related questions
    if (lowerQuestion.includes('math') || lowerQuestion.includes('equation') || 
        lowerQuestion.includes('formula') || lowerQuestion.includes('calculation')) {
        return "For mathematical problems, try breaking them down step by step. Remember to apply the correct order of operations (PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction). If you're stuck with algebra, try isolating the variable on one side of the equation.";
    }
    
    // Science related questions
    if (lowerQuestion.includes('science') || lowerQuestion.includes('physics') || 
        lowerQuestion.includes('chemistry') || lowerQuestion.includes('biology')) {
        return "For science questions, start by identifying the core concepts involved. In physics, remember the fundamental laws like Newton's laws of motion or conservation of energy. For chemistry, consider atomic structure and chemical bonding principles. In biology, think about cellular processes and evolutionary concepts.";
    }
    
    // Computer/programming related questions
    if (lowerQuestion.includes('computer') || lowerQuestion.includes('programming') || 
        lowerQuestion.includes('code') || lowerQuestion.includes('algorithm')) {
        return "When dealing with programming problems, break down the task into smaller steps. Think about the inputs, processing, and outputs. Check for syntax errors and logical errors separately. Remember to test your code with different inputs to ensure it works correctly in all scenarios.";
    }
    
    // Language/writing related questions
    if (lowerQuestion.includes('language') || lowerQuestion.includes('grammar') || 
        lowerQuestion.includes('writing') || lowerQuestion.includes('essay')) {
        return "For language and writing questions, focus on clarity and structure. Make sure your sentences have proper subject-verb agreement. Organize your thoughts with clear introduction, body, and conclusion. Use appropriate transitions between ideas, and always proofread your work for spelling and grammatical errors.";
    }
    
    // Default response for other types of questions
    return "I understand your question about '" + question.substring(0, 30) + "...'. This topic involves several key concepts. First, make sure you understand the fundamentals. Break down complex problems into smaller parts. Practice with different examples to reinforce your understanding. If you're still having trouble, try looking for additional resources or asking your teacher for more specific guidance.";
}

module.exports = router;