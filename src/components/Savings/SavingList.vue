<template>
  <v-container>
    <v-btn class="new">
      <router-link to="/savings/new">
        Create saving
      </router-link>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="savings"
      :items-per-page="15"
      class="elevation-1"
    ></v-data-table>
    <!-- @update="loadData()" -->
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  components: {},
  data() {
    return {
      savings: []
    };
  },
  computed: {
    headers() {
      return [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Description", value: "description" }
      ];
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .get("/api/savings")
        .then(response => {
          // console.log(response);
          this.savings = response.data;
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style lang="scss">
.v-btn.new {
  background-color: rgb(0, 182, 30) !important;

  a {
    color: white;
  }
}
</style>
