<template>
  <div class="accounts">
    <h1>Accounts</h1>
    <v-container>
      <p class="success">{{ successMessage }}</p>
      <p class="error">{{ errorMessage }}</p>
      <v-data-table
        :headers="headers"
        :items="accounts"
        :items-per-page="5"
        :search="search"
        :loading="loadingBool"
        loading-text="Loading... Please wait"
        class="elevation-3 dataTable"
        @update="loadData()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Accounts</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search accounts by email"
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
                          v-model="editedItem.email"
                          label="Email"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.firstName"
                          label="first name"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="last name"
                          :rules="[rules.required]"
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
                  >Are you sure you want to delete the account with account id:
                  {{ editedItem.accountId }}?</v-card-title
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
                  $router.push({ name: 'Account', params: { id: item.id } })
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

      <!-- <Test /> -->
    </v-container>
  </div>
</template>

<script>
import axios from "@/axios-auth";

export default {
  name: "Accounts",
  components: {},
  data: () => ({
    DEBUG: false,
    loadingBool: true,
    dialog: false,
    dialogDelete: false,
    errorMessage: "",
    successMessage: "",
    search: "",
    headers: [
      { text: "Id", value: "id", filterable: false },
      { text: "First name", value: "firstname", filterable: false },
      {
        text: "Last name",
        value: "lastname",
        filterable: false
      },
      { text: "last name", value: "lastname", filterable: false },
      { text: "email", value: "email", filterable: true },
      {
        text: "is active",
        value: "isActive",
        filterable: false
      },
      {
        text: "is admin",
        value: "isAdmin",
        filterable: false
      },
      {
        text: "can post",
        value: "canpost",
        filterable: false
      },
      { text: "Actions", value: "actions", sortable: false, width: "120px" }
    ],
    accounts: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      isAdmin: "",
      isActive: "",
      canPost: []
    },
    defaultItem: {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      isAdmin: "",
      isActive: "",
      canPost: []
    },
    rules: {
      required: value => !!value || "Required."
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New account"
        : "Edit number: " + this.editedItem.id;
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
    this.loadData();
  },

  methods: {
    async loadData() {
      console.log("Aloha");
      this.errorMessage = "";
      this.loadingBool = true;

      axios
        .get("https://jsonplaceholder.typicode.com/todos/1")
        .then(res => {
          console.log("Test" + JSON.stringify(res, null, "\t"));
        })
        .catch(err => {
          console.log("Test" + err);
        });
      axios
        .get("/accounts")
        .then(response => {
          console.log(response);
          this.households = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errorMessage = error;
        })
        .finally(() => (this.loadingBool = false));
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
          .delete("/CMS/accounts/" + this.editedItem.id)
          .then(response => {
            console.log(response);
            this.successMessage =
              "Successfully deleted " + this.editedItem.firstname + ".";
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
          Object.assign(this.accounts[this.editedIndex], this.editedItem);
        } else {
          this.accounts.push(this.editedItem);
        }
        this.close();
      } else {
        if (this.editedIndex > -1) {
          axios
            .put("/accounts/" + this.editedItem.id, this.editedItem)
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
            .post("/accounts", this.editedItem)
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
