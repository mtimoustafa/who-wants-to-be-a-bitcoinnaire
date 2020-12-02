<template>
  <div v-if="questionsPopulated">
    <p>
      Question {{ currentQuestionNumber }} of {{ totalQuestions }}
    </p>

    {{ currentQuestion }}

    <p v-html="currentQuestion.question" />

    <div
      v-for="(answer, index) in answerPool"
      :key="`answer_${index}`"
    >
      <input
        type="radio"
        :id="`answer_${index}`"
        :value="answer"
        v-model="chosenAnswer"
      />

      <label
        :for="`answer_${index}`"
        v-html="answer"
      />
    </div>

    <button @click="submitAnswer">
      Next
    </button>
  </div>

  <div v-else>
    <button @click="populateQuestions">Start</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { knuthShuffle } from 'knuth-shuffle';

export default {
  name: 'Questions',

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
    ...mapState(['questions']),
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
    ...mapActions(['populateQuestions', 'completeRound']),

    startRound() {
      this.answerPool = this.shuffledAnswers(this.currentQuestion);
      // TODO-EXTRA: don't shuffle answers if true/false question
    },

    submitAnswer() {
      if (!this.chosenAnswer) { return; }

      // TODO-EXTRA: display correct answer before moving on, if false answer
      this.currentScore += (this.chosenAnswer === this.currentQuestion.correct_answer);

      if (this.currentQuestionNumber < this.totalQuestions) {
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
      this.$router.push('summary');
    },

    shuffledAnswers(question) {
      return knuthShuffle([question.correct_answer, ...question.incorrect_answers]);
    },
  },
}
</script>
