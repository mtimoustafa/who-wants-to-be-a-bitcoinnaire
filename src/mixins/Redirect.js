import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['roundSetUp']),
  },

  // Using this instead of beforeRouteEnter so we can use the this object
  mounted() {
    if (!this.roundSetUp) {
      this.$router.replace('/');
    }
  },
}
