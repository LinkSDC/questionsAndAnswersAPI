SELECT 'CREATE DATABASE sdc'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sdc')\gexec

SET schema sdc;

CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  slogan TEXT,
  description TEXT,
  category VARCHAR(60),
  default_price INT
);

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  question_body TEXT NOT NULL,
  question_date BIGINT NOT NULL DEFAULT CURRENT_DATE,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT false,
  question_helpfulness INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES product (id)
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body TEXT NOT NULL,
  date BIGINT NOT NULL DEFAULT CURRENT_DATE,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpful INT DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE IF NOT EXISTS answers_photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(255),
  FOREIGN KEY (answer_id) REFERENCES answers (id)
);
