<template>
  <div class="score-breakdown">
    <h2>
      Score: {{ roundStats.score }} of {{ roundStats.totalQuestions }}
    </h2>

    <p>
      Accuracy: {{ percentCorrect }}%
    </p>

    <p>
      Difficulty: {{ capitalise(roundStats.difficulty) }}
    </p>
  </div>

  <button
    class="new-game-button"
    @click="$router.replace('/')"
  >
    New Game
  </button>

  <div>
    <h2 class="high-scores-header">
      High Scores
    </h2>

    <HighScores />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import HighScores from '../components/HighScores';
import Helpers from '../mixins/Helpers';
import Redirect from '../mixins/Redirect';

export default {
  name: 'Summary',

  components: {
    HighScores,
  },

  mixins: [
    Helpers,
    Redirect
  ],

  computed: {
    ...mapState(['roundStats']),
    ...mapGetters(['percentCorrect']),
  },
}
</script>

<style lang="scss" scoped>
.score-breakdown {
  margin-bottom: 1rem;

  h2, p {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
}

.new-game-button {
  margin-bottom: 2rem;
}

.high-scores-header {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
