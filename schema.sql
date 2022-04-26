SELECT 'CREATE DATABASE sdc'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sdc')\gexec

SET schema sdc;

CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
);

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  question_body TEXT NOT NULL,
  question_date BIGINT NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT false,
  question_helpfulness INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES product (id)
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date BIGINT NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpfulness INT DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE IF NOT EXISTS answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(255),
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
);

ALTER TABLE product ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE product ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE questions ALTER COLUMN question_date TYPE timestamp using to_timestamp(question_date/1000)::date
ALTER TABLE questions ALTER COLUMN question_date SET default NOW();

ALTER TABLE answers alter column date TYPE timestamp using to_timestamp(date/1000)::date;
ALTER TABLE answers ALTER COLUMN date SET default NOW();

CREATE INDEX idx_answers_photos_answer_id ON answers_photos(answer_id);
CREATE INDEX idx_questions_product_id ON questions(product_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_questions_reported ON questions(reported);
CREATE INDEX idx_answers_reported ON answers(reported);