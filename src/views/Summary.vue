<template>
  Score: {{ roundStats.score }} of {{ roundStats.totalQuestions }}
  Percent correct: {{ percentCorrect }}%
  Difficulty: {{ roundStats.difficulty }}

  <button @click="$router.push('/')">
    New Game
  </button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Summary',

  computed: {
    ...mapState(['roundStats']),

    percentCorrect() {
      const { score, totalQuestions } = this.roundStats;
      return (score && totalQuestions) ? score / totalQuestions * 100 : 0;
    },
  },
}
</script>
