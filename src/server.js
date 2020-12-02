// TODO: put port in env var
const SERVER_PORT = 8080;

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database('./db/database.sql',  err => {
  if (err) console.error(err.message);
  console.log('Connected to database');
});

// This would be in a migration
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS scores ( \
    score INTEGER, \
    totalQuestions INTEGER, \
    difficulty TINYTEXT \
  )');
});

app.get('/api/high_scores', (req, res, next) => {
  db.all('SELECT * from scores', (err, scores) => {
    res.json(scores);
  });
});

app.post('/api/score', [
  body('score').isInt({ min: 0 }),
  body('totalQuestions').isInt({ min: 0 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
],(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.run('INSERT INTO scores(score, totalQuestions, difficulty) values (?, ?, ?)', [
    req.body.score,
    req.body.totalQuestions,
    req.body.difficulty,
  ], err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(201).json();
  });
});

app.delete('/api/clear_scores', (req, res, next) => {
  db.run('DELETE FROM scores', err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(200).json();
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
