const { pool} = require('../db.js');

const index = async(product_id, page, count) => {
  return await pool.query(
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
        WHERE question_id = questions.question_id AND reported = 'f'
      )
      FROM questions
      WHERE product_id = $1 AND reported = 'f'
      OFFSET $2
      LIMIT $3
    `
    , [product_id, page, count]
    );
}

const create = async(body, name, email, product_id) => {
  return await pool.query(
    'INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES ($1, $2, $3, $4)',
    [product_id, body, name, email]
  );
}

const upVote = async(question_id) => {
  return await pool.query(
    'UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1', [question_id]
  );
}

const report = async(question_id) => {
  return await pool.query(
    'UPDATE questions SET reported = true WHERE question_id = $1', [question_id]
  );
}

module.exports = {
  index,
  create,
  upVote,
  report
}
