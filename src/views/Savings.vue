<template>
  <div class="savings">
    <h1>Savings</h1>
    <v-container>
      <p class="success">{{ successMessage }}</p>
      <p class="error">{{ errorMessage }}</p>
      <v-data-table
        :headers="headers"
        :items="savings"
        :items-per-page="5"
        :search="search"
        :loading="loadingBool"
        loading-text="Loading... Please wait"
        class="elevation-3 dataTable"
        @update="loadData()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Savings</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search name or description"
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
                          v-model="editedItem.name"
                          :rules="[rules.required]"
                          label="Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="editedItem.description"
                          :rules="[rules.required]"
                          label="Description"
                          placeholder="Alleen al met deze gedragsverandering kan je tot wel honderden euros per jaar besparen!"
                          hint="Try and convince people to actually use this saving!"
                        ></v-textarea>
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

            <v-dialog v-model="dialogDelete" max-width="400px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete:
                  {{ editedItem.name }}?</v-card-title
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
                  $router.push({ name: 'Saving', params: { id: item.id } })
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
          <v-btn color="primary" @click="getData">
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
// import Test from "./Test.vue";

export default {
  name: "Savings",
  // components: { Test },
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
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false, width: "120px" }
      ],
      savings: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: "",
        description: ""
      },
      defaultItem: {
        id: 0,
        name: "",
        description: ""
      },
      rules: {
        required: value => !!value || "Required."
      }
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Saving"
        : "Edit: " + this.editedItem.name;
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
        .get("/savings")
        .then(response => {
          console.log(response);
          this.savings = response.data;
          // this.successMessage =
          //   "Success! Got " + this.savings.length + " savings objects.";
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
        this.savings = [
          {
            id: "01",
            name: "Douchen",
            description:
              "Je bespaart veel geld met korter douchen! Natuurlijk is de waterbesparing ook goed voor het milieu."
          },
          {
            id: "02",
            name: "Verwarming uit",
            description:
              "Door wat vaker een trui aan te doen in plaats van de verwarming hoger zetten, bespaar je veel stookkosten! Daarnaast is minder gasverbruik goed voor het milieu.b"
          },
          {
            id: "03",
            name: "Zuiniger wassen",
            description:
              "De meeste wasmachines kunnen tot wel een aantal kilogram aan kleding tegelijk wassen! Probeer altijd helemaal volle wassen te draaien, zo bespaar je niet alleen waterkosten maar ook kosten aan wasmiddel! Daarnaast is de waterbesparing en minder zeepgebruik goed voor de natuur!"
          },
          {
            id: "04",
            name: "Lichten uit",
            description:
              "Wanneer je alle lichten uitzet die niet nodig zijn, kunnen veel mensen erg besparen op elektriciteitskosten! Daarnaast is minder energieverbruik natuurlijk goed voor de natuur."
          },
          {
            id: "05",
            name: "Eten en drinken",
            description:
              "Wist je dat er elk jaar ontzettend veel eten en drinken weggegooid wordt omdat het over de houdsbaarheiddatum is gegaan? Al deze verspilling is ontzettend zonde voor je portomonee en de natuur! Koop alleen wat je echt nodig hebt of maak een plan. Gooi zo min mogelijk eten en drinken weg!"
          },
          {
            id: "06",
            name: "Sixth",
            description: "Hi this is the Sixth description"
          },
          {
            id: "07",
            name: "Seventh",
            description: "Hi this is the Seventh description"
          },
          {
            id: "08",
            name: "Eigth",
            description: "Hi this is the Eigth description"
          },
          {
            id: "09",
            name: "Nineth",
            description: "Hi this is the Nineth description"
          },
          {
            id: "10",
            name: "Tenth",
            description: "Hi this is the Tenth description"
          }
        ];
        this.loadingBool = false;
        // this.successMessage =
        //   "Success! Got " + this.savings.length + " savings objects.";
        // setTimeout(() => (this.successMessage = ""), 2000);
      }, 1000);
    },

    editItem(item) {
      this.editedIndex = this.savings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.savings.indexOf(item);
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
        this.savings.splice(this.editedIndex, 1);
        this.closeDelete();
      } else {
        axios
          .delete("/savings/" + this.editedItem.id)
          .then(response => {
            console.log(response);
            this.successMessage =
              "Successfully deleted " + this.editedItem.name + ".";
            setTimeout(() => (this.successMessage = ""), 2000);
            // this.savings.splice(this.editedIndex, 1);
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
          Object.assign(this.savings[this.editedIndex], this.editedItem);
        } else {
          this.savings.push(this.editedItem);
        }
        this.close();
      } else {
        if (this.editedIndex > -1) {
          axios
            .put("/savings/" + this.editedItem.id, this.editedItem)
            .then(response => {
              console.log(response);
              this.successMessage =
                "Successfully edited " + this.editedItem.name + ".";
              setTimeout(() => (this.successMessage = ""), 2000);
              // Object.assign(this.savings[this.editedIndex], this.editedItem);
              this.$emit("update");
            })
            .catch(error => {
              console.log(error);
              this.errorMessage = error;
            })
            .finally(() => this.close());
        } else {
          axios
            .post("/savings", this.editedItem)
            .then(response => {
              console.log(response);
              this.successMessage =
                "Successfully added " + this.editedItem.name + ".";
              setTimeout(() => (this.successMessage = ""), 2000);
              // this.savings.push(this.editedItem);
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
  margin-left: 6px;
  transition: 0.2s;

  &:hover {
    color: #1976d2;
  }
}
.v-icon.delete {
  margin-left: 6px;
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
