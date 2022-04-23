const { pool} = require('../db.js');

// `select row_to_json(row) as results
// from (
//   select question_id, question_body, (
//     select jsonb(row_to_json(a))
//     from (
//       select * from answers where question_id = questions.question_id
//     ) as a
//   )
//   from questions
//   where product_id = $1 AND reported != 'true'
// ) row`
const getAnswers = async(req, res) => {
  const {question_id} = req.params;

  const send = {page: req.query.page||0, count: req.query.count || 5}
  try {
    let result = await pool.query(
      `
      SELECT answer_id, body, date, answerer_name, helpfulness,
        (
          SELECT coalesce(json_agg(
            json_build_object('id', id, 'url', url)
            ), '[]') as photos
          from answers_photos
          where answer_id = answers.answer_id
        )
      FROM answers
      WHERE question_id = $1
      LIMIT $2
      `,
       [question_id, send.count]
      );
    if (result) {
      let final = {...send, results: result.rows}
      res.json(final);
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