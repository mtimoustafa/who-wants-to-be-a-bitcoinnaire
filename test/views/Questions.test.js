import { mount } from '@vue/test-utils'; // shallowMount is not yet available in Vue Test Utils 2
import { createStore } from 'vuex';
import Store from '../../src/store/store'; // Vue Test Utils 2 doesn't like store mocks yet either
import Questions from '../../src/views/Questions.vue';

let wrapper;

const mockRouter = {
  replace: jest.fn(),
};

const store = createStore(Store);

const mountWrapper = () => {
  wrapper = mount(Questions, {
    global: {
      plugins: [store],
      mocks: {
        $router: mockRouter,
      },
    },
  });
};

describe('Questions', () => {
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
        difficulty: 'medium',
      });
    });

    describe('questions not yet populated', () => {
      it('displays loading message', () => {
        mountWrapper();
        expect(wrapper.text()).toContain('Loading...');
      });
    });

    describe('questions populated', () => {
      beforeEach(() => {
        store.state.roundStats.totalQuestions = 2,
        store.state.questions = [
          {
            category: 'Entertainment: Japanese Anime & Manga',
            type: 'multiple',
            difficulty: 'medium',
            question: 'In Dragon Ball Z, who was the first character to go Super Saiyan 2?',
            correct_answer: 'Gohan',
            incorrect_answers: [ 'Goku', 'Vegeta', 'Trunks' ],
          },
          {
            category: 'Entertainment: Board Games',
            type: 'boolean',
            difficulty: 'easy',
            question: 'The card game Munchkin won the 2001 Origins Award for Best Traditional Card Game.',
            correct_answer: 'True',
            incorrect_answers: [ 'False' ],
          },
        ];

        mountWrapper();
      });

      it('displays question', () => {
        expect(wrapper.text()).toContain(store.state.questions[0].question);
      });

      it('displays question count', () => {
        expect(wrapper.text()).toContain(`Question 1 of ${store.state.roundStats.totalQuestions}`);
      });

      it('displays answers', () => {
        const answers = wrapper.findAll('input[type=radio]');
        const expectedAnswers = [
          ...store.state.questions[0].incorrect_answers,
          ...[store.state.questions[0].correct_answer],
        ];

        expect(answers.map(a => a.attributes('value'))).toEqual(
          expect.arrayContaining(expectedAnswers)
        );
      });

      it('does not submit answer if no answer chosen', async () => {
        await wrapper.get('button').trigger('click');
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });

      describe('on answer submit', () => {
        beforeEach(async () => {
          await wrapper.get('input[type=radio]').setValue();
          await wrapper.get('button').trigger('click');
        });

        it('displays next question', () => {
          expect(wrapper.text()).toContain(store.state.questions[1].question);
        });

        it('displays next set of answers', () => {
          const answers = wrapper.findAll('input[type=radio]');
          const expectedAnswers = [
            ...store.state.questions[1].incorrect_answers,
            ...[store.state.questions[1].correct_answer],
          ];

          expect(answers.map(a => a.attributes('value'))).toEqual(
            expect.arrayContaining(expectedAnswers)
          );
        });

        it('increments question count', async () => {
          expect(wrapper.text()).toContain(`Question 2 of ${store.state.roundStats.totalQuestions}`);
        });

      });

      it('navigates to summary with correct round stats if last question answered', async () => {
        await wrapper.get('input[type=radio]').setValue();
        await wrapper.get('button').trigger('click');

        await wrapper.get('input[type=radio]').setValue();
        await wrapper.get('button').trigger('click');

        expect(mockRouter.replace).toHaveBeenCalledWith('summary');
      });
    });
  });
});
