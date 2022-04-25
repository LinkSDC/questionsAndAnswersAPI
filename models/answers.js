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

const create = async(question_id, body, name, email, photos) =>{
  try {
    let res = await pool.query(
      'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING answer_id', [parseInt(question_id), body, name, email]
      );
    if (res.rows[0].answer_id && photos.length > 0) {
      for(let url of photos) {
        await pool.query(
          'INSERT INTO answers_photos (answer_id, url) VALUES ($1, $2)', [res.rows[0].answer_id, url]
          );
      }
    }
    return true;
  }catch (err) {
    console.log(err);
    return false;
  }
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