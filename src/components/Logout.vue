<template>
  <v-container class="mainContainer" fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-card ref="form">
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
// import axios from "axios";

export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped>
.mainContainer {
  padding: 50px;
}
</style>
