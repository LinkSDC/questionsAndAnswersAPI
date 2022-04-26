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

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);
router.post('/questions', postQuestion);
router.post('/questions/:question_id/answers', postAnswer);
router.put('/questions/:question_id/helpful', upVoteQuestion);
router.put('/questions/:question_id/report', reportQuestion);
router.put('/answers/:answer_id/helpful', upVoteAnswer);
router.put('/answers:answer_id/report', reportAnswer);

module.exports = {
  router
}