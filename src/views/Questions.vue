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
        v-model="chosenAnswerIndex"
      />

      <label :for="`answer_${index}`">
        {{ answer }}
      </label>
    </div>
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
      chosenAnswerIndex: 0,

      answerPool: [],
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
      return this.questions[this.currentQuestionNumber];
    },
  },

  methods: {
    ...mapActions(['populateQuestions']),

    startRound() {
      this.currentQuestionIndex = 0;
      this.chosenAnswerIndex = 0;

      this.answerPool = this.shuffledAnswers(this.currentQuestion);
    },

    shuffledAnswers(question) {
      return knuthShuffle([question.correct_answer, ...question.incorrect_answers]);
    },
  },
}
</script>
