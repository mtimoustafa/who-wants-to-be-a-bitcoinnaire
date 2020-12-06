import { mount } from '@vue/test-utils'; // shallowMount is not yet available in Vue Test Utils 2
import { createStore } from 'vuex';
import Store from '../../src/store/store'; // Vue Test Utils 2 doesn't like store mocks yet either
import Questions from '../../src/views/Questions.vue';

let wrapper;

const mockRouter = {
  replace: jest.fn(),
};

const store = createStore(Store);

beforeEach(() => {
  wrapper = mount(Questions, {
    global: {
      plugins: [store],
      mocks: {
        $router: mockRouter,
      },
    },
  });
});

describe('Questions', () => {
  it('displays placeholder message if no high scores found', () => {
  });

  it('displays high scores', () => {
  });
});
