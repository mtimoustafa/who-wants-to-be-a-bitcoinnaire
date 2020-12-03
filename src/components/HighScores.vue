<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Accuracy</th>
        <th>Difficulty</th>
      </tr>
    </thead>

    <tbody v-if="scoresPopulated">
      <tr
        v-for="(score, index) in allScores"
        :key="index"
      >
        <td>{{ score.playerName }}</td>
        <td>{{ score.score }} of {{ score.totalQuestions }}</td>
        <td>{{ score.rankingScore }}%</td>
        <td>{{ score.difficulty }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="4">No high scores...yet!</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'HighScores',

  props: {
    extraScores: {
      type: Array,
      default: undefined,
    },
  },

  computed: {
    ...mapState(['highScores']),
    ...mapGetters(['percentCorrect']),

    scoresPopulated() {
      return this.allScores?.length > 0;
    },

    allScores() {
      const formattedScores = [];
      if (this.extraScores) {
        this.extraScores.map(score => { return { ...score, rankingScore: this.percentCorrect } });
      }
      return (this.highScores) ? [ ...this.highScores, ...formattedScores ] : formattedScores;
    },
  },

  methods: {
    ...mapActions(['getHighScores']),
  },

  mounted() {
    if (!this.highScoresPopulated) {
      this.getHighScores();
    }
  },
}
</script>
