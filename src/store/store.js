import axios from 'axios';

export default {
  state: {
    openTriviaApiPath: 'https://opentdb.com/api.php',
    bitcoinaireApiPath: 'http://localhost:8081/api',

    triviaProperties: {
      amount: 10,
      difficulty: 'easy',
    },

    questions: {},
    roundStats: {
      playerName: '',
      score: 0,
      totalQuestions: 0,
      difficulty: '',
    },
  },

  getters: {
    questionsPopulated(state) {
      return state.questions && Object.keys(state.questions).length > 0;
    },

    defaultRoundStats() {
      return {
        playerName: '',
        score: 0,
        totalQuestions: 0,
        difficulty: '',
      };
    },

    percentCorrect(state) {
      const { score, totalQuestions } = state.roundStats;
      return (score && totalQuestions) ? score / totalQuestions * 100 : 0;
    },
  },

  mutations: {
    setQuestions(state, questions) {
      state.questions = questions;
    },

    clearQuestions(state) {
      state.questions = {};
    },

    setRoundStats(state, stats) {
      state.roundStats = stats;
    },

    setDifficulty(state, difficulty) {
      state.triviaProperties.difficulty = difficulty;
    },
  },

  actions: {
    async populateQuestions({ state, commit }) {
      commit('clearQuestions');

      const { data: { results: questions } } = await axios.get(state.openTriviaApiPath, { params: state.triviaProperties });
      // TODO: validation for when API returns an error

      commit('setQuestions', questions);
    },

    startNewRound({ commit, getters, dispatch }, { playerName, difficulty }) {
      commit('setRoundStats', {
        ...getters.defaultRoundStats,
        playerName,
        difficulty,
      });
      commit('setDifficulty', difficulty);
      dispatch('populateQuestions', { difficulty });
    },

    completeRound({ state, commit, dispatch }, score) {
      const totalQuestions = state.questions.length || 0;

      commit('setRoundStats', {
        playerName: state.roundStats.playerName,
        score,
        totalQuestions,
        difficulty: state.triviaProperties.difficulty,
      });

      dispatch('submitStats');
    },

    async submitStats({ state, getters }) {
      await axios.post(`${state.bitcoinaireApiPath}/scores`, { ...state.roundStats, rankingScore: getters.percentCorrect });
    },
  },
};
