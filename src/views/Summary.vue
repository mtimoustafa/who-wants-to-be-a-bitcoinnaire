<template>
  Score: {{ roundStats.score }} of {{ roundStats.totalQuestions }}
  Percent correct: {{ percentCorrect }}%
  Difficulty: {{ roundStats.difficulty }}

  <button @click="$router.push('/')">
    New Game
  </button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Summary',

  computed: {
    ...mapState(['roundStats']),
    ...mapGetters(['percentCorrect']),
  },
}
</script>
