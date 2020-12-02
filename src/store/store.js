import axios from 'axios';

export default {
  state: {
    openTriviaApiPath: 'https://opentdb.com/api.php',
    triviaProperties: {
      amount: 10,
      difficulty: 'easy',
    },

    questions: {},
    roundStats: {
      score: 0,
      totalQuestions: 0,
      percentCorrect: '0%',
      difficulty: '',
    },
  },

  getters: {
    triviaPropertiesAsParams(state) {
      return Object.entries(state.triviaProperties)
                   .map(([key, value]) => `${key}=${value}`)
                   .join('&');
    },

    questionsPopulated(state) {
      return state.questions && Object.keys(state.questions).length > 0;
    },
  },

  mutations: {
    setQuestions(state, questions) {
      state.questions = questions;
    },

    setRoundStats(state, stats) {
      state.roundStats = stats;
    },

    setDifficulty(state, difficulty) {
      state.triviaProperties.difficulty = difficulty;
    },
  },

  actions: {
    async populateQuestions({ state, commit, getters }) {
      let query = `${state.openTriviaApiPath}?${getters.triviaPropertiesAsParams}`;
      const { data: { results: questions } } = await axios.get(query);

      // TODO: validation for when API returns an error

      commit('setQuestions', questions);
    },

    startNewRound({ commit, dispatch }, { difficulty }) {
      commit('setDifficulty', difficulty);
      commit('setRoundStats', {
        score: 0,
        totalQuestions: 0,
        percentCorrect: '0%',
        difficulty: '',
      });
      dispatch('populateQuestions');
    },

    completeRound({ state, commit }, score) {
      const totalQuestions = state.questions.length || 0;
      const percentCorrect = (score && totalQuestions) ? score / totalQuestions * 100 : 0;

      commit('setRoundStats', {
        score,
        totalQuestions,
        percentCorrect: `${percentCorrect}%`,
        difficulty: state.triviaProperties.difficulty,
      });
    },
  },
};
