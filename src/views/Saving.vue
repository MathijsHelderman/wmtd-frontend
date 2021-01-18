<template>
  <v-container>
    <v-row class="backButton" justify="start">
      <router-link to="/savings"
        ><v-btn color="primary" dark class="mb-2">back</v-btn></router-link
      >
    </v-row>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <p class="success">{{ successMessage }}</p>
        <p class="error">{{ errorMessage }}</p>
        <v-card max-width="400px">
          <v-card-title> {{ saving.name }} </v-card-title>
          <v-card-text class="text-justify">
            {{ saving.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  name: "Saving",
  components: {},
  data: () => ({
    DEBUG: true,
    loadingBool: true,
    errorMessage: "",
    successMessage: "",
    saving: {
      id: -1,
      name: "",
      description: ""
    }
  }),

  mounted() {
    if (this.DEBUG) {
      this.getMock();
    } else {
      this.getSaving();
    }
  },

  methods: {
    getMock() {
      // console.log(this.$route.params.id);
      this.saving = {
        id: "1",
        name: "Zuiniger wassen",
        description:
          "De meeste wasmachines kunnen tot wel een aantal kilogram aan kleding tegelijk wassen! Probeer altijd helemaal volle wassen te draaien, zo bespaar je niet alleen waterkosten maar ook kosten aan wasmiddel! Daarnaast is de waterbesparing en minder zeepgebruik goed voor de natuur!"
      };
    },
    getSaving() {
      this.errorMessage = "";
      this.loadingBool = true;
      axios
        .get("/savings/" + this.$route.params.id)
        .then(response => {
          console.log(response);
          if (response.data.length > 0) {
            this.saving = response.data[0];
            this.successMessage = "Success! Got the saving object.";
            setTimeout(() => (this.successMessage = ""), 2000);
          } else {
            this.errorMessage = "Could not retrieve saving.";
          }
        })
        .catch(error => {
          console.log(error);
          this.errorMessage = error;
        })
        .finally(() => (this.loadingBool = false));
    }
  }
};
</script>

<style lang="scss">
.error {
  color: white;
}
.success {
  color: white;
}
.backButton {
  margin-top: 10px;
}
</style>
