<template>
  <div class="lobby">
    <div class="game-options">
      <div
        class="player-name-wrapper"
        :class="{ 'player-name-wrapper--error': formError }"
      >
        <label
          for="player-name-input"
          class="form-label"
        >
          Player name
        </label>

        <div
          class="player-name-input-wrapper"
        >
          <input
            id="player-name-input"
            v-model.trim="playerName"
            @keydown.enter.stop="startRound"
          />

          <span
            v-if="formError"
            class="player_name_error_message"
          >
            Please enter a name
          </span>
        </div>
      </div>

      <div>
        <label
          for="difficulty-select"
          class="form-label"
        >
          Difficulty
        </label>

        <select
          id="difficulty-select"
          v-model="difficulty"
          @keydown.enter.stop="startRound"
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

<style lang="scss" scoped>
@mixin input-field-style {
  padding: 0.3rem 0.5rem;
  border: 1px solid #bbb;
  border-radius: 4px;
}

$error-color: #a81d32;

.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-options {
  margin-bottom: 2rem;
}

.form-label {
  display: inline-block;
  width: 6.8rem;
}

.player-name-wrapper {
  margin-bottom: 1.2rem;

  &.player-name-wrapper--error {
    margin-bottom: 2.5rem;

    #player-name-input {
      border-color: $error-color;
    }
  }
}

.player-name-input-wrapper {
  display: inline-block;
  position: relative;
}

#player-name-input {
  @include input-field-style;
}

#difficulty-select {
  @include input-field-style;
}

.player_name_error_message {
  position: absolute;
  top: 2.2rem;
  left: 0;

  font-size: 0.9rem;
  color: $error-color;
}
</style>
