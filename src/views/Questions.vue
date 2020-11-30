<template>
  Question {{ questionNumber }} of {{ totalQuestions }}
</template>

<script>
export default {
  name: 'Questions',

  data() {
    return {
      questionNumber: 1,
      totalQuestions: 20,
    };
  },
}
</script>
