<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="households"
      :items-per-page="15"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  components: {},
  data() {
    return {
      products: []
    };
  },
  computed: {
    headers() {
      return [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Category", value: "category.name" },
        { text: "Description", value: "description" },
        { text: "Price", value: "price" }
      ];
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .get("/api/households")
        .then(response => {
          // console.log(response);
          this.households = response.data;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style></style>
