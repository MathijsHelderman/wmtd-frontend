<template>
  <v-app>
    <v-main>
      <v-app-bar app color="primary" dark>
        <Login v-if="!this.$store.getters.isAuthenticated" />
      </v-app-bar>
      <h1>Hi</h1>
      <!-- <HelloWorld /> -->
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import Login from "./components/Login";

export default {
  name: "App",

  components: {
    Login
  },

  data: () => ({
    //
  }),
  computed: {
    token() {
      return this.$store.state.token;
    }
  }
};
</script>
