import axios from 'axios';

export default {
  state: {
    // Vue 3 is refusing to accept any environment variables :(
    bitcoinaireApiPath: 'https://bitcoinaire-front-end.herokuapp.com:8081/api`,
    openTriviaApiPath: 'https://opentdb.com/api.php',

    roundSetUp: false,
    questions: {},
    highScores: [],

    roundStats: {
      playerName: '',
      score: 0,
      totalQuestions: 0,
      difficulty: '',
    },
    defaultRoundStats: {
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

    setHighScores(state, highScores) {
      state.highScores = highScores;
    },

    setRoundSetUp(state, roundSetUp) {
      state.roundSetUp = roundSetUp;
    },
  },

  actions: {
    async populateQuestions({ state, commit }) {
      commit('clearQuestions'); // Prevent old question flicker on starting new round

      const triviaParams = {
        amount: 10,
        difficulty: state.roundStats.difficulty || 'easy',
      };

      try {
        const { data: { results: questions } } = await axios.get(state.openTriviaApiPath, { params: triviaParams  });
        commit('setQuestions', questions);
      } catch (error) {
        // TODO: this could be more sophisticated. E.g. sanitize error message, print it out in front-end, log it somewhere
        console.error(error);
      }
    },

    startNewRound({ state, commit, dispatch }, { playerName, difficulty }) {
      commit('setRoundStats', {
        ...state.defaultRoundStats,
        playerName,
        difficulty,
      });
      commit('setRoundSetUp', true);
      dispatch('populateQuestions', { difficulty });
    },

    completeRound({ state, commit, dispatch }, score) {
      const totalQuestions = state.questions.length || 0;

      commit('setRoundStats', {
        playerName: state.roundStats.playerName,
        score,
        totalQuestions,
        difficulty: state.roundStats.difficulty,
      });

      dispatch('submitStats');
    },

    async submitStats({ state, getters }) {
      try {
        await axios.post(`${state.bitcoinaireApiPath}/scores`, { ...state.roundStats, rankingScore: getters.percentCorrect });
      } catch (error) {
        // TODO: this could be more sophisticated. E.g. sanitize error message, print it out in front-end, log it somewhere
        console.error(error);
      }
    },

    async getHighScores({ state, commit }) {
      try {
        const { data: highScores } = await axios.get(`${state.bitcoinaireApiPath}/high_scores`);
        commit('setHighScores', highScores);
      } catch (error) {
        // TODO: this could be more sophisticated. E.g. sanitize error message, print it out in front-end, log it somewhere
        console.error(error);
      }
    },
  },
};
