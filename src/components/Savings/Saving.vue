<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-btn>
          <router-link to="/savings">
            Back to all savings
          </router-link>
        </v-btn>
        <v-card>
          <v-btn color="orange" @click="updateSaving">
            Update
          </v-btn>
          <v-btn color="red" @click="deleteSaving">
            Delete
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
