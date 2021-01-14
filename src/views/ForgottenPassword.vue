<template>
  <v-container class="mainContainer" fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-card ref="form">
          <v-card-title>Forgot your password?</v-card-title>
          <v-card-text
            >Please enter your email below. If you have an account, you will
            receive an email with details on how to change your
            password.</v-card-text
          >
          <v-alert v-if="message" type="success">
            {{ message }}
          </v-alert>
          <v-alert v-if="errorMessage" type="error">
            {{ errorMessage }}
          </v-alert>
          <v-form>
            <v-text-field
              ref="email"
              v-model="email"
              label="Email"
              :rules="[rules.required, rules.email]"
              placeholder="john@doe.com"
            ></v-text-field>
          </v-form>
          <v-card-actions>
            <v-btn text @click="cancel">
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip v-if="email" left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="my-0"
                    v-bind="attrs"
                    @click="resetForm"
                    v-on="on"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>Refresh form</span>
              </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn color="primary" @click="submit()">
              submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  name: "ForgottenPassword",
  data() {
    return {
      DEBUG: false,
      email: "",
      formHasErrors: true,
      message: "",
      errorMessage: "",
      rules: {
        required: value => !!value || "Required.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (pattern.test(value)) {
            this.formHasErrors = false;
            return true;
          } else {
            this.formHasErrors = true;
            return "Invalid e-mail.";
          }
        }
      }
    };
  },
  computed: {
    form() {
      return {
        email: this.email
      };
    }
  },
  watch: {
    email() {
      if (this.email) {
        this.message = "";
      }
    }
  },
  methods: {
    cancel() {
      this.$router.push({ name: "Home" });
    },
    resetForm() {
      this.formHasErrors = false;

      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset();
      });
    },
    submit() {
      if (!this.formHasErrors) {
        this.errorMessage = "";
        if (this.DEBUG) {
          this.message = "Email send to " + this.email + ".";
        } else {
          axios
            .post("/accounts/requestPasswordResetEmail", this.email)
            .then(response => {
              console.log(response);
              this.message = "Email send to " + this.email + ".";
            })
            .catch(error => {
              console.log(error);
              this.errorMessage = error;
            });
        }
        this.resetForm();
      }
    }
  }
};
</script>

<style>
.mainContainer {
  padding: 50px;
}
.v-card {
  padding: 40px;
}
</style>
