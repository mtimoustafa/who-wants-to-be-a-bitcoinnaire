import { createStore } from 'vuex';
import axios from 'axios';
import Store from '../../src/store/store';

const store = createStore(Store);
jest.mock('axios');

describe('store', () => {
  const openTriviaApi = 'https://opentdb.com/api.php';
  const questions = { question1: 'test1', question2: 'test2' };

  afterEach(() => {
    store.state.roundStats = { ...store.state.defaultRoundStats };
    store.state.questions = {};
  });

  describe('default state', () => {
    it('starts with correct flags for views', () => {
      expect(store.state.roundSetUp).toEqual(false);
    });

  });
  describe('getters', () => {
    describe('questionsPopulated', () => {
      it('returns false when questions not present', () => {
        expect(store.getters.questionsPopulated).toEqual(false);
      });

      it('returns true when questions are present', () => {
        store.state.questions = questions;
        expect(store.getters.questionsPopulated).toEqual(true);
      });
    });

    describe('percentCorrect', () => {
      it('returns 0 when score and totalQuestions not set', () => {
        expect(store.getters.percentCorrect).toEqual(0);
      });

      it('returns 0 when score not set', () => {
        store.state.roundStats.totalQuestions = 10;
        expect(store.getters.percentCorrect).toEqual(0);
      });

      it('returns 0 when totalQuestions not set', () => {
        store.state.roundStats.score = 5;
        expect(store.getters.percentCorrect).toEqual(0);
      });

      it('returns correct value when score and totalQuestions present', () => {
        store.state.roundStats.score = 5;
        store.state.roundStats.totalQuestions = 10;
        expect(store.getters.percentCorrect).toEqual(50);
      });
    });
  });

  describe('mutations', () => {
    it('sets questions with setQuestions', () => {
      store.commit('setQuestions', questions);
      expect(store.state.questions).toEqual(
        expect.objectContaining(questions)
      );
    });

    it('clears questions with clearQuestions', () => {
      store.state.questions = { question1: 'test1', question2: 'test2' };
      store.commit('clearQuestions');
      expect(store.state.questions).toEqual({});
    });

    it('sets round stats with setRoundStats', () => {
      const roundStats = {
        playerName: 'Testy test',
        score: 5,
        totalQuestions: 10,
        difficulty: 'medium',
      };
      store.commit('setRoundStats', roundStats);
      expect(store.state.roundStats).toEqual(
        expect.objectContaining(roundStats)
      );
    });

    it('sets high scores with setHighScores', () => {
      const highScores = [
        {
          playerName: 'Testy Test',
          score: 5,
          totalQuestions: 10,
          rankingScore: 50,
          difficulty: 'easy',
        },
      ];
      store.commit('setHighScores', highScores);
      expect(store.state.highScores).toEqual(
        expect.objectContaining(highScores)
      );
    });

    it('sets roundSetUp with setRoundSetUp', () => {
      store.commit('setRoundSetUp', true);
      expect(store.state.roundSetUp).toEqual(true);
    });
  });

  describe('actions', () => {
    describe('populateQuestions', () => {
      beforeEach(() => {
        axios.get.mockResolvedValue({ data: { results: { questions } } });
      });

      it('calls Open Trivia API with correct params', async () => {
        await store.dispatch('populateQuestions');

        expect(axios.get).toHaveBeenCalledWith(openTriviaApi, {
          params: {
            amount: 10,
            difficulty: 'easy',
          },
        });
      });

      it('calls Open Trivia API with correct difficulty', async () => {
        store.state.roundStats.difficulty = 'medium';
        await store.dispatch('populateQuestions');

        expect(axios.get).toHaveBeenCalledWith(openTriviaApi, {
          params: {
            amount: 10,
            difficulty: 'medium',
          },
        });
      });


      it('sets questions correctly from API call', async () => {
        await store.dispatch('populateQuestions');
        expect(store.state.questions).toEqual(
          expect.objectContaining({ questions: questions })
        );
      });

      it('does not set questions if API call fails', async () => {
        axios.get.mockRejectedValue('Mock API failure');
        await store.dispatch('populateQuestions');
        expect(store.state.questions).toEqual({});
      });
    });
  });
});
