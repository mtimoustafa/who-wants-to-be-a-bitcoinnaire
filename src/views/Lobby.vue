<template>
  <div>
    <div class="lobby__game-options">
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
</template>

<script>
export default {
  name: 'Lobby',

  data() {
    return {
      difficulties: [
        { id: 'easy', label: 'Easy' },
        { id: 'medium', label: 'Medium' },
        { id: 'hard', label: 'Hard' },
      ],
      difficulty: '',
    };
  },

  mounted() {
    this.difficulty = this.difficulties[0].id;
  }
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
</style>
