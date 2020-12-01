import axios from 'axios';

export default {
  state: {
    currentQuestion: 1,
    totalQuestions: 20,
    openTriviaApiPath: 'https://opentdb.com/api.php',
    triviaProperties: {
      amount: 10,
    },
    questions: {},
  },

  getters: {
    triviaPropertiesAsParams(state) {
      return Object.entries(state.triviaProperties)
                   .map(([key, value]) => `${key}=${value}`)
                   .join('&');
    },
  },

  mutations: {
    setQuestions(state, questions) {
      state.questions = questions;
    },
  },

  actions: {
    async testOpenTriviaApi({ state, commit, getters }) {
      let query = `${state.openTriviaApiPath}?${getters.triviaPropertiesAsParams}`;
      const { data: { results: questions } } = await axios.get(query);

      // TODO: validation for when API returns an error

      commit('setQuestions', questions);
    },
  },
};
