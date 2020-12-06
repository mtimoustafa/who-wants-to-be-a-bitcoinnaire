import { mount } from '@vue/test-utils'; // shallowMount is not yet available in Vue Test Utils 2
import { createStore } from 'vuex';
import Store from '../../src/store/store'; // Vue Test Utils 2 doesn't like store mocks yet either
import Lobby from '../../src/views/Lobby.vue';

let wrapper;

const mockRouter = {
  replace: jest.fn(),
};

const store = createStore(Store);

beforeEach(() => {
  wrapper = mount(Lobby, {
    global: {
      plugins: [store],
      mocks: {
        $router: mockRouter,
      },
    },
  });
});

describe('Lobby', () => {
  it('provides player name field', () => {
    expect(wrapper.find('input'));
  });

  it('provides difficulty field', () => {
    expect(wrapper.find('select'));
  });

  it('provides correct difficulty settings', () => {
    const difficulty = wrapper.get('select');
    const difficultyOptions = difficulty.findAll('option').map(o => o.element.label);

    expect(difficultyOptions).toEqual(
      expect.arrayContaining([ 'Easy', 'Medium', 'Hard' ])
    );
  });

  it('displays validation error if submitting without player name', async () => {
    const startButton = wrapper.get('button');
    await startButton.trigger('click');

    expect(wrapper.text()).toContain('Please enter a name');
  });

  it('displays validation error if player name cleared', async () => {
    const playerName = wrapper.get('input');
    await playerName.setValue('Testy test');
    await playerName.setValue('');

    expect(wrapper.text()).toContain('Please enter a name');
  });

  it('trims whitespace from player name', async () => {
    const playerName = wrapper.get('input');
    const startButton = wrapper.get('button');

    await playerName.setValue('  Testy test ');
    await startButton.trigger('click');

    expect(store.state.roundStats.playerName).toEqual('Testy test');
  });

  it('navigates to questions page with correct settings', async () => {
    const playerName = wrapper.get('input');
    const difficulty = wrapper.get('select');
    const startButton = wrapper.get('button');

    await playerName.setValue('Testy test');
    await difficulty.setValue('medium');

    await startButton.trigger('click');

    expect(store.state.roundStats.playerName).toEqual('Testy test');
    expect(store.state.roundStats.difficulty).toEqual('medium');
    expect(mockRouter.replace).toHaveBeenCalledWith('questions');
  });

  it('does not navigate if player name missing', async () => {
    const startButton = wrapper.get('button');
    await startButton.trigger('click');

    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
