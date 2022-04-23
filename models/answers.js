const { pool } = require('../db.js');

const index = async(question_id, count, page) => {
  return await pool.query(
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
     [question_id, count]
    );
}

const create = async(body, name, email, question_id, photos) =>{
  return await pool.query(
    'INSERT INTO answers (question_id, body, anwerer_name, answerer_email) VALUES ($1, $2, $3, $4)', [question_id, body, name, email]
    );
}

const upVote = async(answer_id) =>{
  return await pool.query(
    'UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1', [answer_id]
  );
}

const report = async(answer_id) => {
  return await pool.query(
    'UPDATE answers SET reported = true WHERE answer_id = $1', [answer_id]
  );
}

module.exports = {
  index,
  create,
  upVote,
  report
}