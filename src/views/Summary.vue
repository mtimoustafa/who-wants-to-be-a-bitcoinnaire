<template>
  Score: {{ roundStats.score }} of {{ roundStats.totalQuestions }}
  Percent correct: {{ percentCorrect }}%
  Difficulty: {{ roundStats.difficulty }}

  <button @click="$router.replace('/')">
    New Game
  </button>

  <HighScores />
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import HighScores from '../components/HighScores';
import Redirect from '../mixins/Redirect';

export default {
  name: 'Summary',

  components: {
    HighScores,
  },

  mixins: [Redirect],

  computed: {
    ...mapState(['roundStats']),
    ...mapGetters(['percentCorrect']),
  },
}
</script>
