<template>
  <div>
    <v-app-bar app color="#EEE" light>
      <router-link to="/"
        ><v-img
          :src="require('../assets/small_logo.png')"
          class="headerLogo"
          contain
          height="20"
          width="20"
      /></router-link>
      <div id="nav">
        <router-link to="/">Home</router-link>
        <span v-if="this.$store.getters.isAuthenticated">
          <router-link to="/accounts">
            Accounts
          </router-link>
          <router-link to="/households">
            Households
          </router-link>
          <router-link to="/savings">
            Savings
          </router-link>
        </span>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Header",
  components: {}
};
</script>

<style lang="scss" scope>
.headerLogo {
  max-width: 20px;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    opacity: 0.7;
    margin-left: 10px;
    text-decoration: none;

    &.router-link-exact-active {
      opacity: 1;
      color: #42b983;

      &:hover {
        text-decoration: none;
        cursor: default;
      }
    }
    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
}
</style>
