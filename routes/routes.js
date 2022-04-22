const express = require('express');
const router = express.Router();
const {
  getQuestions,
  postQuestion,
  upVoteQuestion,
  reportQuestion
} = require('../controllers/questions.js');
const {
  getAnswers,
  postAnswer,
  upVoteAnswer,
  reportAnswer
} = require('../controllers/answers.js');

// GET /questions
// query_params product_id, page, count
router.get('/questions', getQuestions);
// GET /questions/:question_id/answers
// query params - count, page
router.get('/questions/:question_id/answers', getAnswers);
// POST /questions
router.post('/questions', postQuestion);
// POST /questions/:question_id/answers
router.post('/questions/:question_id/answers', postAnswer);
// PUT /questions/:question_id/helpful
router.put('/questions/:question_id/helpful', upVoteQuestion);
// PUT /questions/:question_id/report
router.put('/questions/:question_id/report', reportQuestion);
// PUT /answers/:answer_id/helpful
router.put('/answers/:answer_id/helpful', upVoteAnswer);
// PUT /answers:answer_id/report
router.put('/answers:answer_id/report', reportAnswer);

module.exports = {
  router
}