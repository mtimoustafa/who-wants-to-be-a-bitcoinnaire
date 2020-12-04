<template>
  <div>
    <div class="game-options">
      <div class="player-name-wrapper">
        <label for="player-name">
          Player name
        </label>

        <div>
          <input
            id="player-name"
            class="player-name-input"
            :class="{ 'player-name--error': formError }"
            v-model="playerName"
          />

          <div
            v-if="formError"
            class="player_name_error_message"
          >
            Please enter a name
          </div>
        </div>
      </div>

      <div class="difficulty-select">
        <label for="difficulty-select">
          Difficulty
        </label>

        <select
          id="difficulty-select"
          v-model="difficulty"
        >
          <option
            v-for="difficulty in difficulties"
            :key="difficulty.id"
            :value="difficulty.id"
          >
            {{ difficulty.label }}
          </option>
        </select>
      </div>
    </div>

    <button @click="startRound">
      Start
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Lobby',

  data() {
    return {
      difficulties: [
        { id: 'easy', label: 'Easy' },
        { id: 'medium', label: 'Medium' },
        { id: 'hard', label: 'Hard' },
      ],
      playerName: '',
      difficulty: '',
      formError: false,
    };
  },

  watch: {
    playerName() {
      this.validateForm();
    },
  },

  methods: {
    ...mapActions(['startNewRound']),

    validateForm() {
      this.formError = !this.playerName;
    },

    startRound() {
      this.validateForm();
      if (this.formError) return;

      this.startNewRound({
        playerName: this.playerName,
        difficulty: this.difficulty,
      });
      this.$router.replace('questions');
    },
  },

  mounted() {
    this.difficulty = this.difficulties[0].id;
  },
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.player-name-wrapper {
  display: flex;
  justify-content: center;
}

.player-name-input {
  display: block;
}
</style>
