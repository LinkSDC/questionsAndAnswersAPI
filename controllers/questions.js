const { pool} = require('../db.js');

const getQuestions = async(req, res) => {
  const { product_id } = req.query;
  try {
    let result = await pool.query(
      `SELECT question_id, to_timestamp(question_date/1000)::date question_date, asker_name, question_helpfulness, reported
       FROM questions WHERE product_id = $1`, [product_id]
      );
    if (result) {
      res.json(result.rows)
    }
  } catch (err) {
    res.status(400);
    console.log('Q-GET', err);
  }
}

const postQuestion = async(req, res) => {
  const { question_id } = req.params;
  const { body, name, email, product_id } = req.body;

  try {
    let result = await pool.query(
      'INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES ()', []
      );
    if (result) {
      res.status(201);
    }
  } catch (err) {
    res.status(400);
    console.log('Q-POST', err);
  }
}

const upVoteQuestion = async(req, res) => {
  const { question_id } = req.params;
  console.log(question_id)
  try {
    let result = await pool.query(
      'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1', [question_id]
    );
    console.log(result)
    if (result?.rowCount) {
      res.status(204);
    }
  } catch (err) {
    res.status(400);
    console.log('Q-UPVOTE', err);
  }
}

const reportQuestion = async(req, res) => {
  const { question_id } = req.params;
  try {
    let result = await pool.query(
      'UPDATE questions SET reported = true WHERE question_id = $1', [question_id]
    );
    if (result) {
      res.status(204);
    }
  } catch (err) {
    res.status(400);
    console.log('Q-REPORT', err);
  }
}

module.exports = {
  getQuestions,
  postQuestion,
  upVoteQuestion,
  reportQuestion
}