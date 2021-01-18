<template>
  <v-container class="mainContainer" fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-card ref="form">
          <v-img
            :src="require('../assets/logo-header.svg')"
            class="logo"
            contain
            height="200"
          />
          <v-card-text>
            <v-alert v-if="this.$store.getters.getError != null" type="warning">
              {{ this.$store.getters.getError }}
            </v-alert>
            <v-text-field
              v-model="authData.email"
              :rules="[rules.required, rules.email]"
              label="Email"
              placeholder="john@doe.com"
            ></v-text-field>
            <v-text-field
              v-model="authData.password"
              :rules="[rules.required, rules.password]"
              type="Password"
              label="Password"
            ></v-text-field>
            <router-link :to="{ name: 'ForgottenPassword' }"
              >Forgot your password?</router-link
            >
            <v-btn class="loginButton" color="primary" @click="login">
              Login
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
  data() {
    return {
      authData: {
        email: "",
        password: ""
      },
      emailHasErrors: true,
      rules: {
        required: value => !!value || "Required.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (pattern.test(value)) {
            this.emailHasErrors = false;
            return true;
          } else {
            this.emailHasErrors = true;
            return "Invalid e-mail.";
          }
        },
        password: value => value.length > 9 || "At least 10 characters required"
      }
    };
  },
  methods: {
    login() {
      if (!this.emailHasErrors && this.authData.password.length > 9) {
        this.$store.dispatch("login", this.authData);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mainContainer {
  padding: 50px;
}
.v-card {
  padding: 20px;
}
.loginButton {
  margin-left: 30px;
}
</style>
