// TODO: put port in env var
const SERVER_PORT = 8081;

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8080',
}));

const db = new sqlite3.Database('./db/database.sql',  err => {
  if (err) console.error(err.message);
  console.log('Connected to database');
});

// TODO: put this in a migration
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS scores ( \
    playerName TEXT, \
    score INTEGER, \
    totalQuestions INTEGER, \
    difficulty TINYTEXT \
  )');
});

app.get('/api/scores', (req, res, next) => {
  db.all('SELECT * from scores', (err, scores) => {
    res.json(scores);
  });
});

app.post('/api/scores', [
  body('playerName').not().isEmpty().trim().escape(),
  body('score').isInt({ min: 0 }),
  body('totalQuestions').isInt({ min: 0 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
],(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.run('INSERT INTO scores(playerName, score, totalQuestions, difficulty) values (?, ?, ?, ?)', [
    req.body.playerName,
    req.body.score,
    req.body.totalQuestions,
    req.body.difficulty,
  ], err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(201).json();
  });
});

app.delete('/api/scores', (req, res, next) => {
  db.run('DELETE FROM scores', err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(200).json();
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
