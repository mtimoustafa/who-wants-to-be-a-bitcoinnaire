<template>
  Question {{ currentQuestion }} of {{ totalQuestions }}

  <button @click="testOpenTriviaApi">Test</button>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Questions',

  computed: {
    ...mapState([
      'currentQuestion',
      'totalQuestions',
      'questions',
    ]),
  },

  methods: {
    ...mapActions(['testOpenTriviaApi']),
  },
}
</script>
