<template>
  <div class="households">
    <h1>Households</h1>
    <v-container>
      <p class="success">{{ successMessage }}</p>
      <p class="error">{{ errorMessage }}</p>
      <v-data-table
        :headers="headers"
        :items="households"
        :items-per-page="5"
        :search="search"
        :loading="loadingBool"
        loading-text="Loading... Please wait"
        class="elevation-3 dataTable"
        @update="loadData()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Households</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search house number (addition)"
              single-line
              hide-details
            ></v-text-field>

            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="300px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.floor"
                          label="Floor"
                          type="number"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.maxNumberOfAccounts"
                          label="Max number of accounts"
                          type="number"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.houseNumber"
                          label="HouseNumber"
                          type="number"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.houseNumberAddition"
                          label="HouseNumberAddition"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn class="save" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete the household with
                  housenumber:
                  {{
                    editedItem.houseNumber + editedItem.houseNumberAddition
                  }}?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn class="deleteConfirm" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="edit"
                v-bind="attrs"
                v-on="on"
                @click="
                  $router.push({ name: 'Household', params: { id: item.id } })
                "
              >
                mdi-details
              </v-icon>
            </template>
            <span>View details</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="edit"
                v-bind="attrs"
                v-on="on"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }"
              ><v-icon
                small
                class="delete"
                v-bind="attrs"
                v-on="on"
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="loadData">
            Reset
          </v-btn>
        </template>
      </v-data-table>

      <v-btn color="primary" @click="getData">
        Refresh
      </v-btn>
      <!-- <Test /> -->
    </v-container>
  </div>
</template>

<script>
import axios from "@/axios-auth";

export default {
  name: "Households",
  components: {},
  data() {
    return {
      DEBUG: true,
      loadingBool: true,
      dialog: false,
      dialogDelete: false,
      errorMessage: "",
      successMessage: "",
      search: "",
      headers: [
        { text: "Id", value: "id", filterable: false },
        { text: "Code", value: "code", filterable: false },
        {
          text: "Max Number Of Accounts",
          value: "maxNumberOfAccounts",
          filterable: false
        },
        { text: "Floor", value: "floor", filterable: false },
        { text: "House number", value: "houseNumber", filterable: true },
        {
          text: "House number addition",
          value: "houseNumberAddition",
          filterable: true
        },
        { text: "Actions", value: "actions", sortable: false, width: "120px" }
      ],
      households: [],
      editedIndex: -1,
      editedItem: {
        id: "0",
        code: "",
        maxNumberOfAccounts: 0,
        floor: 0,
        houseNumber: 0,
        houseNumberAddition: "",
        householdSavings: [],
        accounts: []
      },
      defaultItem: {
        id: "0",
        code: "",
        maxNumberOfAccounts: 0,
        floor: 0,
        houseNumber: 0,
        houseNumberAddition: "",
        householdSavings: [],
        accounts: []
      },
      rules: {
        required: value => !!value || "Required."
      }
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Household"
        : "Edit number: " +
            this.editedItem.houseNumber +
            this.editedItem.houseNumberAddition;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      if (this.DEBUG) {
        this.initializeMock();
      } else {
        this.loadData();
      }
    },
    loadData() {
      this.errorMessage = "";
      this.loadingBool = true;
      axios
        .get("/households")
        .then(response => {
          console.log(response);
          this.households = response.data.data[0];
          // this.successMessage =
          //   "Success! Got " + this.households.length + " household objects.";
          // setTimeout(() => (this.successMessage = ""), 2000);
        })
        .catch(error => {
          console.log(error);
          this.errorMessage = error;
        })
        .finally(() => (this.loadingBool = false));
    },

    initializeMock() {
      this.errorMessage = "";
      setTimeout(() => {
        this.households = [
          {
            id: "01",
            code: "JR0W9U",
            maxNumberOfAccounts: 4,
            floor: 3,
            houseNumber: 45,
            houseNumberAddition: "b",
            householdSavings: [],
            accounts: []
          },
          {
            id: "02",
            code: "AW0W9U",
            maxNumberOfAccounts: 5,
            floor: 4,
            houseNumber: 225,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "03",
            code: "BR0W9U",
            maxNumberOfAccounts: 5,
            floor: 4,
            houseNumber: 226,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "04",
            code: "JRVD9U",
            maxNumberOfAccounts: 4,
            floor: 3,
            houseNumber: 46,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "05",
            code: "JR0WES",
            maxNumberOfAccounts: 4,
            floor: 3,
            houseNumber: 47,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "06",
            code: "JEW39U",
            maxNumberOfAccounts: 4,
            floor: 3,
            houseNumber: 48,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "07",
            code: "340W9U",
            maxNumberOfAccounts: 5,
            floor: 4,
            houseNumber: 227,
            houseNumberAddition: "c",
            householdSavings: [],
            accounts: []
          },
          {
            id: "08",
            code: "J236GU",
            maxNumberOfAccounts: 3,
            floor: 1,
            houseNumber: 2,
            houseNumberAddition: "",
            householdSavings: [],
            accounts: []
          },
          {
            id: "09",
            code: "G34W9U",
            maxNumberOfAccounts: 6,
            floor: 9,
            houseNumber: 1045,
            houseNumberAddition: "b",
            householdSavings: [],
            accounts: []
          },
          {
            id: "10",
            code: "RF2W9U",
            maxNumberOfAccounts: 4,
            floor: 10,
            houseNumber: 1045,
            houseNumberAddition: "a",
            householdSavings: [],
            accounts: []
          }
        ];
        this.loadingBool = false;
        // this.successMessage =
        //   "Success! Got " + this.households.length + " households objects.";
        // setTimeout(() => (this.successMessage = ""), 2000);
      }, 1000);
    },

    editItem(item) {
      this.editedIndex = this.households.indexOf(item);
      // console.log(this.editedIndex);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.households.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    deleteItemConfirm() {
      this.errorMessage = "";
      if (this.DEBUG) {
        this.households.splice(this.editedIndex, 1);
        this.closeDelete();
      } else {
        axios
          .delete("/households/" + this.editedItem.id)
          .then(response => {
            console.log(response);
            this.successMessage =
              "Successfully deleted " + this.editedItem.name + ".";
            setTimeout(() => (this.successMessage = ""), 2000);
            // this.households.splice(this.editedIndex, 1);
            this.$emit("update");
          })
          .catch(error => {
            console.log(error);
            this.errorMessage = error;
          })
          .finally(() => this.closeDelete());
      }
    },

    save() {
      this.errorMessage = "";
      if (this.DEBUG) {
        if (this.editedIndex > -1) {
          Object.assign(this.households[this.editedIndex], this.editedItem);
        } else {
          this.households.push(this.editedItem);
        }
        this.close();
      } else {
        if (this.editedIndex > -1) {
          axios
            .put("/households/" + this.editedItem.id, this.editedItem)
            .then(response => {
              console.log(response);
              this.successMessage =
                "Successfully edited " + this.editedItem.name + ".";
              setTimeout(() => (this.successMessage = ""), 2000);
              // Object.assign(this.households[this.editedIndex], this.editedItem);
              this.$emit("update");
            })
            .catch(error => {
              console.log(error);
              this.errorMessage = error;
            })
            .finally(() => this.close());
        } else {
          axios
            .post("/households", this.editedItem)
            .then(response => {
              console.log(response);
              this.successMessage =
                "Successfully added " + this.editedItem.name + ".";
              setTimeout(() => (this.successMessage = ""), 2000);
              // this.households.push(this.editedItem);
              this.$emit("update");
            })
            .catch(error => {
              console.log(error);
              this.errorMessage = error;
            })
            .finally(() => this.close());
        }
      }
    }
  }
};
</script>

<style lang="scss">
.v-btn {
  &.save {
    background-color: rgb(0, 182, 30) !important;
    color: white;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &.deleteConfirm {
    background-color: red !important;
    color: white;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
}
.dataTable {
  padding-top: 8px;
  margin-bottom: 50px;
}
.v-icon.edit {
  margin-right: 6px;
  transition: 0.2s;

  &:hover {
    color: #1976d2;
  }
}
.v-icon.delete {
  transition: 0.2s;

  &:hover {
    color: red;
  }
}
.error {
  color: white;
}
.success {
  color: white;
}
h1 {
  margin-top: 30px;
}
</style>
