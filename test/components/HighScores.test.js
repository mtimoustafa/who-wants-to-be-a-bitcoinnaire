import { mount } from '@vue/test-utils'; // shallowMount is not yet available in Vue Test Utils 2
import { createStore } from 'vuex';
import Store from '../../src/store/store'; // Vue Test Utils 2 doesn't like store mocks yet either
import HighScores from '../../src/components/HighScores.vue';

let wrapper;

const mockRouter = {
  replace: jest.fn(),
};

const store = createStore(Store);

const mountWrapper = () => {
  wrapper = mount(HighScores, {
    global: {
      plugins: [store],
      mocks: {
        $router: mockRouter,
      },
    },
  });
};

describe('HighScores', () => {
  it('shows correct columns', () => {
    mountWrapper();

    const headers = wrapper.findAll('th');
    expect(headers.map(h => h.text())).toEqual(
      expect.arrayContaining([
        'Name',
        'Score',
        'Accuracy',
        'Difficulty',
      ])
    );
  });

  it('displays placeholder message if no high scores found', () => {
    mountWrapper();

    // Only header and row with placeholder message should show
    expect(wrapper.findAll('tr').length).toEqual(2);
    expect(wrapper.text()).toContain('No high scores...yet!');
  });

  describe('high scores present', () => {
    beforeEach(() => {
      store.state.highScores = [
        {
          playerName: 'Test 1',
          score: 5,
          totalQuestions: 10,
          rankingScore: 50,
          difficulty: 'easy',
        },
        {
          playerName: 'Test 2',
          score: 4,
          totalQuestions: 10,
          rankingScore: 40,
          difficulty: 'medium',
        },
      ];

      mountWrapper();
    });

    it('displays correct number of scores', () => {
      const [ header, ...scores ] = wrapper.findAll('tr');
      expect(scores.length).toEqual(2);
    });

    it('displays score correctly', () => {
      const [ header, score1, score2 ] = wrapper.findAll('tr');
      const scoreDetails = score1.findAll('td');

      const expectedScore = `${store.state.highScores[0].score} of ${store.state.highScores[0].totalQuestions}`;

      expect(scoreDetails[0].text()).toEqual(store.state.highScores[0].playerName);
      expect(scoreDetails[1].text()).toEqual(expectedScore);
      expect(scoreDetails[2].text()).toEqual(`${store.state.highScores[0].rankingScore}%`);
      expect(scoreDetails[3].text()).toEqual('Easy');
    });
  });
});
