const { pool} = require('../db.js');

// SELECT answer_id, body, date, answerer_name, helpfulness,
//   (
//     SELECT coalesce(json_agg(
//       json_build_object('id', id, 'url', url)
//       ), '[]') as photos
//     from answers_photos
//     where answer_id = answers.answer_id
//   )
// FROM answers
// WHERE question_id = questions.question_id

const getQuestions = async(req, res) => {
  const { product_id } = req.query;
  const final = {product_id}
  try {
    let result = await pool.query(
      `
        SELECT
          question_id, question_body, question_date,
          asker_name, question_helpfulness, reported, (
          SELECT COALESCE(
            JSON_OBJECT_AGG(
              "answer_id", JSON_BUILD_OBJECT(
                'id', answer_id, 'body', body, 'date', date,
                'answerer_name', answerer_name,
                'helpfulness', helpfulness, 'photos',
                (
                  SELECT COALESCE(JSON_AGG(url), '[]') as photos
                  FROM answers_photos
                  WHERE answer_id = answers.answer_id
                )
              )
            ), '{}') as answers
          FROM answers
          WHERE question_id = questions.question_id
        )
        FROM questions
        WHERE product_id = $1 AND reported != 'true'
      `
      , [product_id]
      );
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
    let result = await pool.query(
      'INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES ($1, $2, $3, $4)',
      [product_id, body, name, email]
    );
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
    let result = await pool.query(
      'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1', [question_id]
    );

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
    let result = await pool.query(
      'UPDATE questions SET reported = true WHERE question_id = $1', [question_id]
    );
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