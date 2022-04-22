const { pool} = require('../db.js');

const getAnswers = async(req, res) => {
  const {question_id} = req.params;

  try {
    let result = await pool.query(
      'SELECT answer_id as id, to_timestamp(date/1000)::date date, answerer_name, helpfulness FROM answers WHERE question_id = $1', [question_id]
      );
    if (result) {
      res.json(result.rows);
    }
  } catch (err) {
    res.status(400);
    console.log('A-GET', err);
  }
}

const postAnswer = async(req, res) => {
  const { answer_id } = req.params;
  const { body, name, email, photos } = req.body;

  try {
    let result = await pool.query(
      'INSERT INTO answers (body, anwerer_name, answerer_email) VALUES ($1, $2, $3)', [body, name, email]
      );
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
    let result = await pool.query(
      'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1', [answer_id]
    );
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
    let result = await pool.query(
      'UPDATE answers SET reported = true WHERE answer_id = $1', [answer_id]
    );
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