<template>
  Score: {{ lastRound.score }} of {{ lastRound.totalQuestions }}
  Percent correct: {{ lastRound.percentCorrect }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Summary',

  computed: {
    ...mapState(['lastRound']),
  },
}
</script>
