<template>
  <div v-if="questionsPopulated">
    <h2 class="question-count">
      Question {{ currentQuestionNumber }} of {{ totalQuestions }}
    </h2>

    <div class="question-wrapper">
      <p
        v-html="currentQuestion.question"
        class="question-text"
      />

      <div class="answers-wrapper">
        <div
          v-for="(answer, index) in answerPool"
          :key="`answer_${index}`"
          class="answer-item"
        >
          <input
            type="radio"
            :id="`answer_${index}`"
            :value="answer"
            v-model="chosenAnswer"
            class="answer-radio-button"
            @keydown.enter.stop="submitAnswer"
          />

          <label
            :for="`answer_${index}`"
            v-html="answer"
          />
        </div>
      </div>

      <button @click="submitAnswer">
        Next
      </button>
    </div>
  </div>

  <div v-else>
    Loading...
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { knuthShuffle } from 'knuth-shuffle';
import Redirect from '../mixins/Redirect';

export default {
  name: 'Questions',

  mixins: [Redirect],

  data() {
    return {
      currentQuestionIndex: 0,
      chosenAnswer: undefined,

      answerPool: [],
      currentScore: 0,
    };
  },

  watch: {
    questions() {
      this.startRound();
    },
  },

  computed: {
    ...mapState(['roundSetUp', 'questions']),
    ...mapGetters(['questionsPopulated']),

    totalQuestions() {
      return this.questions?.length || 0;
    },

    currentQuestionNumber() {
      return this.currentQuestionIndex + 1;
    },

    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
  },

  methods: {
    ...mapActions(['completeRound']),

    startRound() {
      this.answerPool = this.shuffledAnswers(this.currentQuestion);
      // TODO-EXTRA: don't shuffle answers if true/false question
    },

    submitAnswer() {
      if (!this.chosenAnswer) { return; }

      // TODO-EXTRA: display correct answer before moving on, if false answer
      this.currentScore += (this.chosenAnswer === this.currentQuestion.correct_answer);

      if (this.currentQuestionNumber < this.totalQuestions) {
        this.chosenAnswer = undefined;
        this.getNextQuestion();
      } else {
        this.submitRound();
      }
    },

    getNextQuestion() {
      this.chosenAnswer = '';
      this.currentQuestionIndex += 1;
      this.answerPool = this.shuffledAnswers(this.currentQuestion);
    },

    submitRound() {
      this.completeRound(this.currentScore);
      this.$router.replace('summary');
    },

    shuffledAnswers(question) {
      return knuthShuffle([question.correct_answer, ...question.incorrect_answers]);
    },
  },
}
</script>

<style lang="scss" scoped>
.question-count {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.question-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-text {
  margin-top: 0;
  margin-bottom: 2rem;
}

.answers-wrapper {
  margin-bottom: 2rem;
}

.answer-item {
  text-align: left;
  margin-bottom: 0.5rem;
}

.answer-radio-button {
  margin-right: 1rem;
}
</style>
