<template>
  <v-container>
    <v-row class="backButton" justify="start">
      <router-link to="/accounts"
        ><v-btn color="primary" dark class="mb-2">back</v-btn></router-link
      >
    </v-row>
    <v-row justify="center">
      <v-col cols="10" md="8" lg="6">
        <p class="success">{{ successMessage }}</p>
        <p class="error">{{ errorMessage }}</p>
        <v-card>
          <v-card-title>
            Household of number:
            <!-- {{ household.houseNumber + household.houseNumberAddition }} -->
            {{ this.$route.params.id }}
          </v-card-title>

          <v-card-text class="text-left">
            <h3>General info:</h3>
            <table style="border:none;">
              <tbody>
                <tr>
                  <th>Parameter:</th>
                  <th>Value:</th>
                </tr>
                <tr>
                  <td>First name:</td>
                  <td>{{ account.firstname }}</td>
                </tr>
                <tr>
                  <td>Last name</td>
                  <td>{{ account.lastname }}</td>
                </tr>
                <tr>
                  <td>email:</td>
                  <td>{{ account.email }}</td>
                </tr>
                <tr>
                  <td>is admin</td>
                  <td>
                    {{ household.isAdmin}}
                  </td>
                </tr>
              </tbody>
            </table>

          

            
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  name: "Account",
  components: {},
  data: () => ({
    DEBUG: false,
    loadingBool: true,
    errorMessage: "",
    successMessage: "",
    household: {
      id: "",
      email: "",
      firstname: "",
      lastname: "",
      isAdmin: "",
      isActive: "",
      canPost:""
      
      
    }
  }),

  mounted() {
    
      this.getHousehold();
    
  },

  methods: {
    
    getHousehold() {
      console.log(" api call...");
      this.errorMessage = "";
      this.loadingBool = true;
      axios
        .get("/accounts/" + this.$route.params.id)
        .then(response => {
          console.log(response);
          if (response.data.length > 0) {
            this.household = response.data[0];
            this.successMessage = "Success! Got the household object.";
            setTimeout(() => (this.successMessage = ""), 2000);
          } else {
            this.errorMessage = "Could not retrieve household.";
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
.v-icon.edit {
  margin-left: 6px;
  transition: 0.2s;

  &:hover {
    color: #1976d2;
  }
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
