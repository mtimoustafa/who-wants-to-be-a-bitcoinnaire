require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.VUE_PATH,
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
    rankingScore FLOAT, \
    difficulty TINYTEXT \
  )');
});

// TODO: add knex for cleaner SQL query building
app.get('/api/high_scores', (req, res, next) => {
  db.all('SELECT * from scores ORDER BY rankingScore DESC LIMIT 10', (err, scores) => {
    res.status(200).json(scores);
  });
});

app.post('/api/scores', [
  body('playerName').not().isEmpty().trim().escape(),
  body('score').isInt({ min: 0 }),
  body('totalQuestions').isInt({ min: 0 }),
  body('rankingScore').isDecimal(),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
],(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.run('INSERT INTO scores(playerName, score, totalQuestions, rankingScore, difficulty) values (?, ?, ?, ?, ?)', [
    req.body.playerName,
    req.body.score,
    req.body.totalQuestions,
    req.body.rankingScore,
    req.body.difficulty,
  ], err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(201).json(req.body);
  });
});

// This is a debug endpoint i.e. not being used in the app
// It's a shortcut for me to reset the database on the proof of concept
app.delete('/api/scores', (req, res, next) => {
  db.run('DELETE FROM scores', err => {
    if (err) res.status(500).json({ error: err.message });
    res.status(200).json();
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = { app, db };
