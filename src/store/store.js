import axios from 'axios';

export default {
  state: {
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

    questionsPopulated(state) {
      return state.questions && Object.keys(state.questions).length > 0;
    },
  },

  mutations: {
    setQuestions(state, questions) {
      state.questions = questions;
    },
  },

  actions: {
    async populateQuestions({ state, commit, getters }) {
      let query = `${state.openTriviaApiPath}?${getters.triviaPropertiesAsParams}`;
      const { data: { results: questions } } = await axios.get(query);

      // TODO: validation for when API returns an error

      commit('setQuestions', questions);
    },
  },
};
