<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="savings"
      :items-per-page="10"
      :search="search"
      :loading="loadingBool"
      loading-text="Loading... Please wait"
      class="elevation-1"
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
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.description"
                        label="Description"
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

          <v-dialog v-model="dialogDelete" max-width="500px">
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
        <v-icon small class="edit" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="delete" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="loadData">
          Reset
        </v-btn>
      </template>
    </v-data-table>

    <!-- <Test /> -->
  </v-container>
</template>

<script>
import axios from "@/axios-auth";
// import Test from "./Test.vue";

export default {
  // components: { Test },
  data: () => ({
    loadingBool: true,
    dialog: false,
    dialogDelete: false,
    search: "",
    headers: [
      { text: "Id", value: "id", filterable: false },
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Actions", value: "actions", sortable: false }
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
    }
  }),

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
    // this.loadData();
    this.initializeMock();
  },

  methods: {
    loadData() {
      axios
        .get("/savings")
        .then(response => {
          // console.log(response);
          this.savings = response.data;
        })
        .catch(error => console.log(error));
    },
    async initializeMock() {
      setTimeout(() => {
        this.savings = [
          {
            id: "01",
            name: "First",
            description: "Hi this is the First q description"
          },
          {
            id: "02",
            name: "Second",
            description: "Hi this is the Second w description"
          },
          {
            id: "03",
            name: "Third",
            description: "Hi this is the Third x description"
          },
          {
            id: "04",
            name: "Fourth",
            description: "Hi this is the Fourth description"
          },
          {
            id: "05",
            name: "Fifth",
            description: "Hi this is the Fifth description"
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

    deleteItemConfirm() {
      this.savings.splice(this.editedIndex, 1);
      this.closeDelete();
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.savings[this.editedIndex], this.editedItem);
      } else {
        this.savings.push(this.editedItem);
      }
      this.close();
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
  margin-top: 30px;
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
</style>
