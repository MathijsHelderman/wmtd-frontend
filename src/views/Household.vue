<template>
  <v-container>
    <v-row class="backButton" justify="start">
      <router-link to="/households"
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
                  <td>Code:</td>
                  <td>{{ household.code }}</td>
                </tr>
                <tr>
                  <td>Maximum number of accounts:</td>
                  <td>{{ household.maxNumberOfAccounts }}</td>
                </tr>
                <tr>
                  <td>Floor:</td>
                  <td>{{ household.floor }}</td>
                </tr>
                <tr>
                  <td>House number and addition:</td>
                  <td>
                    {{ household.houseNumber + household.houseNumberAddition }}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>Household savings:</h3>
            <table>
              <tr>
                <th>Name:</th>
                <th>Daily savings:</th>
              </tr>
              <tr
                v-for="householdSaving in household.householdSavings"
                :key="householdSaving.id"
              >
                <td>{{ householdSaving.saving.name }}</td>
                <td>{{ householdSaving.dailySavings }}</td>
              </tr>
            </table>

            <h3>Accounts:</h3>
            <table>
              <tr>
                <th>Full name:</th>
                <th>Actions:</th>
              </tr>
              <tr v-for="account in household.accounts" :key="account.id">
                <td>
                  {{ account.firstname + " " + account.lastname }}
                </td>
                <td>
                  <template>
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          small
                          class="edit"
                          v-bind="attrs"
                          v-on="on"
                          @click="
                            $router.push({
                              name: 'Account',
                              params: { id: account.id }
                            })
                          "
                        >
                          mdi-details
                        </v-icon>
                      </template>
                      <span>View details</span>
                    </v-tooltip>
                  </template>
                </td>
              </tr>
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
  name: "Household",
  components: {},
  data: () => ({
    DEBUG: true,
    loadingBool: true,
    errorMessage: "",
    successMessage: "",
    household: {
      id: "",
      code: "",
      maxNumberOfAccounts: -1,
      floor: -1,
      houseNumber: -1,
      houseNumberAddition: "",
      householdSavings: [
        {
          id: "",
          saving: {
            id: "",
            name: "",
            description: ""
          },
          dailySavings: -1
        }
      ],
      accounts: [
        {
          id: "",
          email: "",
          hashedPassword: null,
          firstname: "",
          lastname: "",
          isActive: null,
          isAdmin: null,
          canPost: null,
          savings: []
        }
      ]
    }
  }),

  mounted() {
    if (this.DEBUG) {
      this.getMock();
    } else {
      this.getHousehold();
    }
  },

  methods: {
    getMock() {
      this.household = {
        id: "1",
        code: "JR0W9U",
        maxNumberOfAccounts: 4,
        floor: 3,
        houseNumber: 45,
        houseNumberAddition: "b",
        householdSavings: [
          {
            id: "1",
            saving: {
              id:
                "cd009d90a8db027c0972e9abb01f290d0530750d4cbc3afbb8f08d4631da0a74",
              name: "Douchen",
              description:
                "Minder douchen elke maand bespaart je veel geld! Daarnaast is het goed voor het milieu. Water is namelijk kostbaar aangezien het eerst gereinigd moet worden!"
            },
            dailySavings: 5.13
          },
          {
            id: "2",
            saving: {
              id:
                "96ada53f88be666c3aa9d296e4a6a59faeed86a830fcbe6111d82211be03c471",
              name: "Verwarming uit",
              description:
                "In de winter kan het natuurlijk erg koud worden. Maar een heel huis verwarmen kost veel energie! In plaats van het hele huis verwarmen kan je ook ervoor kiezen om jezelf te verwarmen! Als je in plaats van de verwarming aandoet een trui aandoet, bespaar je veel geld en het is ook nog eens beter voor het mileu!"
            },
            dailySavings: 4.98
          }
        ],
        accounts: [
          {
            id: "5ff2efa75013a1607cab049e",
            email: "a@b.nl",
            hashedPassword: null,
            firstname: "Joe",
            lastname: "Doe",
            isActive: true,
            isAdmin: false,
            canPost: true,
            savings: []
          },
          {
            id: "5ff2efa75013a1607cab049f",
            email: "c@d.nl",
            hashedPassword: null,
            firstname: "Tom",
            lastname: "de Smit",
            isActive: true,
            isAdmin: false,
            canPost: true,
            savings: []
          }
        ]
      };
    },
    getHousehold() {
      console.log("Actually doing api call...");
      this.errorMessage = "";
      this.loadingBool = true;
      axios
        .get("/households/" + this.$route.params.id)
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
