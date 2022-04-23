const {
  index, create, upVote, report
} = require('../models/questions.js');

const getQuestions = async(req, res) => {
  const product_id = req.query.product_id || null;
  const count = req.query.count || 4;
  const page = req.query.page || 0;

  const final = {product_id}
  if (!product_id) return res.sendStatus(400);

  try {
    let result = await index(product_id, page, count);

    if (result) {
      final.results = result.rows
      res.json(final)
    }
  } catch (err) {
    res.sendStatus(400);
    console.log('Q-GET', err);
  }
}

const postQuestion = async(req, res) => {
  const { body, name, email, product_id } = req.body;

  try {
    let result = await create(body, name, email, product_id);

    if (result) {
      res.sendStatus(201);
    }
  } catch (err) {
    res.sendStatus(400);
    console.log('Q-POST', err);
  }
}

const upVoteQuestion = async(req, res) => {
  const { question_id } = req.params;

  try {
    let result = await upVote(question_id);

    if (result) {
      res.sendStatus(204);
    }
  } catch (err) {
    res.sendStatus(400);
    console.log('Q-UPVOTE', err);
  }
}

const reportQuestion = async(req, res) => {
  const { question_id } = req.params;
  try {
    let result = await report(question_id);

    if (result) {
      res.sendStatus(204);
    }
  } catch (err) {
    res.sendStatus(400);
    console.log('Q-REPORT', err);
  }
}

module.exports = {
  getQuestions,
  postQuestion,
  upVoteQuestion,
  reportQuestion
}