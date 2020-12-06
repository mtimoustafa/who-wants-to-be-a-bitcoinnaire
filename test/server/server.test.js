// TODO: use knex to separate production and test databases
const supertest = require('supertest');
const { app: server, db } = require('../../src/server/server');

const request = supertest(server);

describe('server', () => {
  const score = {
    playerName: 'Testy test',
    score: 2,
    totalQuestions: 10,
    rankingScore: 20,
    difficulty: 'medium',
  };

  it('allows front-end through CORS', done => {
    request.get('/api/high_scores')
      .expect('Access-Control-Allow-Origin', process.env.VUE_PATH)
      .end((err, res) => {
        expect(err).toBeFalsy();
        done();
      });
  });

  describe('/api/high_scores', () => {
    it('returns 200 on GET', done => {
      request.get('/api/high_scores')
        .expect(200)
        .end((err, res) => {
          expect(err).toBeFalsy();
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining(score)
            ])
          );
          done();
        });
    });
  });

  describe('/api/scores', () => {
    it('returns 201 on POST with valid parameters', done => {
      request.post('/api/scores')
        .expect(201)
        .send(score)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(err).toBeFalsy();
          expect(res.body).toEqual(expect.objectContaining(score));
          done();
        });
    });

    it('returns 400 on POST with malformed parameters', done => {
      request.post('/api/scores')
        .expect(400)
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(err).toBeFalsy();
          done();
        });
    });

    it('returns 500 on POST if database query fails', done => {
      db.close();

      request.post('/api/scores')
        .expect(500)
        .send(score)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(err).toBeFalsy();
          done();
        });
    });
  });
});
