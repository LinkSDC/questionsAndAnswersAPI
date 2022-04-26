const { pool } = require('../db.js');
const {
  index,
  create,
  upVote,
  report
} = require('../models/answers.js');

const getAnswers = async(req, res) => {
  const {question_id} = req.params;
  const page = req.query.page || 0;
  const count = req.query.count || 5;

  try {
    let result = await index(question_id, count, page);

    if (result) {
      let final = {page, count, results: result.rows}
      res.json(final);
    }
  } catch (err) {
    res.status(400);
    console.log('A-GET', err);
  }
}

const postAnswer = async(req, res) => {
  const { question_id } = req.params;
  const { body, name, email, photos } = req.body;
  console.log( question_id, body, name, email, photos)
  try {
    let result = await create(question_id, body, name, email, photos);

    if (result) {
      res.sendStatus(201);
    }
  } catch (err) {
    res.status(400);
    console.log('A-POST', err);
  }
}

const upVoteAnswer = async(req, res) => {
  const { answer_id } = req.params;

  try {
    let result = await upVote(answer_id);
    if (result) {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(400);
    console.log('A-UPVOTE', err);
  }
}

const reportAnswer = async(req, res) => {
  const { answer_id } = req.params;

  try {
    let result = await report(answer_id);

    if (result) {
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(400);
    console.log('A-REPORT', err);
  }
}

module.exports = {
  getAnswers,
  postAnswer,
  upVoteAnswer,
  reportAnswer
}