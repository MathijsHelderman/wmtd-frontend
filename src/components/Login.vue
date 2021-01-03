<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-card ref="form">
          <v-card-text>
            <v-alert v-if="authData.error" type="error">
              {{ authData.error }}
            </v-alert>
            <v-text-field
              v-model="authData.username"
              label="Username"
            ></v-text-field>
            <v-text-field
              v-model="authData.password"
              type="Password"
              label="Password"
            ></v-text-field>
            <v-btn color="primary" @click="login"> Login </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      authData: {
        username: "",
        password: "",
        error: ""
      }
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.authData);
    }
    // login() {
    //   axios
    //     .post("https://localhost:44365/Login", {
    //       username: this.username,
    //       password: this.password,
    //     })
    //     .then((res) => console.log(res))
    //     .catch((error) => (this.error = error));
    // },
  }
};
</script>

<style></style>
