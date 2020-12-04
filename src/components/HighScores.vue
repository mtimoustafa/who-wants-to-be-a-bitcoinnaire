<template>
  <table
    class="high-scores-table"
    cellspacing="0"
  >
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
        <td>{{ capitalise(score.difficulty) }}</td>
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
import Helpers from '../mixins/Helpers';

export default {
  name: 'HighScores',

  mixins: [Helpers],

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

<style lang="scss" scoped>
.high-scores-table {
  width: 100%;
  text-align: left;
  border: 1px solid #bbb;
  border-radius: 4px;
  table-layout: fixed;

  tr:nth-child(even) {
    background: #f7f7f7;
  }

  th, td {
    padding: 0.3rem 0.5rem;
    width: 50%;
    text-align: left;
    border-left: 1px solid #bbb;
    word-break: break-word;

    &:first-child {
      border: none;
    }
  }

  th {
    background: #eee;
  }
}
</style>
