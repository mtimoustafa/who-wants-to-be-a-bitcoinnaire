<template>
  Question {{ currentQuestion }} of {{ totalQuestions }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Questions',

  computed: {
    ...mapState([
      'currentQuestion',
      'totalQuestions',
    ]),
  },
}
</script>
