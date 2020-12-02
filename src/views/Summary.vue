<template>
  Score: {{ roundStats.score }} of {{ roundStats.totalQuestions }}
  Percent correct: {{ roundStats.percentCorrect }}
  Difficulty: {{ roundStats.difficulty }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Summary',

  computed: {
    ...mapState(['roundStats']),
  },
}
</script>
