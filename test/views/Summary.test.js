import { mount } from '@vue/test-utils'; // shallowMount is not yet available in Vue Test Utils 2
import { createStore } from 'vuex';
import Store from '../../src/store/store'; // Vue Test Utils 2 doesn't like store mocks yet either
import Summary from '../../src/views/Summary.vue';

let wrapper;

const mockRouter = {
  replace: jest.fn(),
};

const store = createStore(Store);

const mountWrapper = () => {
  wrapper = mount(Summary, {
    global: {
      plugins: [store],
      mocks: {
        $router: mockRouter,
      },
    },
  });
};

describe('Summary', () => {
  describe('round not set up', () => {
    it('routes to lobby if round not set up', () => {
      mountWrapper();
      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });
  });

  describe('round set up', () => {
    beforeEach(() => {
      store.state.roundSetUp = true;
      Object.assign(store.state.roundStats, {
        playerName: 'Testy test',
        score: 5,
        totalQuestions: 10,
        difficulty: 'medium',
      });

      mountWrapper();
    });

    it('displays score', () => {
      expect(wrapper.text()).toContain(`Score: ${store.state.roundStats.score} of ${store.state.roundStats.totalQuestions}`);
    });

    it('displays accuracy', () => {
      expect(wrapper.text()).toContain(`Accuracy: ${store.getters.percentCorrect}%`);
    });

    it('displays difficulty', () => {
      expect(wrapper.text()).toContain('Difficulty: Medium');
    });

    it('allows starting a new game', async () => {
      await wrapper.get('button').trigger('click');
      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    it('displays high score table', () => {
      expect(wrapper.text()).toContain('High Scores');
      expect(wrapper.find('table'));
    });
  });
});
