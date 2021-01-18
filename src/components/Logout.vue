<template>
  <v-container class="mainContainer" fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-card>
          <v-card-title>
            Welcome to We Make The District CMS
            {{ this.printTokens() }}
          </v-card-title>
          <v-card-text>
            Name:
            {{ this.$store.getters.getName }}
            <br />
            Email:
            {{ this.$store.getters.getEmail }}
          </v-card-text>
          <v-card-text>
            <p>You can log out by clicking the button below.</p>
            <v-btn class="loginButton" color="primary" @click="logout">
              Logout
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import axios from "@/axios-auth";

export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    printTokens() {
      // let tokens = {
      //   accessToken: localStorage.getItem("access_token"),
      //   refreshToken: localStorage.getItem("refresh_token")
      // };
      // console.log("Tokens: " + JSON.stringify(tokens, null, "\t"));
      // axios
      //   .get("https://jsonplaceholder.typicode.com/todos/1")
      //   .then(res => {
      //     console.log("Test" + JSON.stringify(res, null, "\t"));
      //   })
      //   .catch(err => {
      //     console.log("Test" + err);
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.mainContainer {
  padding: 50px;
}
</style>
