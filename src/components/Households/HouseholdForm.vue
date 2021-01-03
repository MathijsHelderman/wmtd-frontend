<template>
  <v-form ref="form">
    <!-- <param name="id"></param>
		<param name="code"></param>
		<param name="maxNumberOfAccounts"></param>
		<param name="houseNumber"></param>
		<param name="houseNumberAddition"></param>
    <param name="householdSavings"></param>
    <param name="accounts"></param> -->

    <v-text-field v-model="code" label="Code"></v-text-field>
    <v-text-field
      v-model="maxNumberOfAccounts"
      label="MaxNumberOfAccounts"
    ></v-text-field>
    <v-text-field v-model="houseNumber" label="HouseNumber"></v-text-field>
    <v-text-field
      v-model="houseNumberAddition"
      label="HouseNumberAddition"
    ></v-text-field>
    <v-select
      v-model="savingId"
      :items="savings"
      item-text="name"
      item-value="id"
      label="Saving"
    ></v-select>
    <v-btn color="primary" @click="addHousehold"> Add household </v-btn>
  </v-form>
</template>

<script>
import axios from "@/axios-auth";

export default {
  data() {
    return {
      name: "Household",
      description: "",
      savingId: 0,
      price: 0,
      savings: []
    };
  },
  methods: {
    addHousehold() {
      const postData = {
        Id: 0,
        Name: this.name,
        Description: this.description,
        SavingId: this.savingId,
        Price: parseFloat(this.price)
      };
      console.log(postData);
      axios
        .post("/api/households", postData)
        .then(res => {
          console.log(res.data);
          this.$refs.form.reset();
          this.$emit("update");
        })
        .catch(error => console.log(error.response.request._response));
    }
  },
  mounted() {
    axios
      .get("/api/savings")
      .then(response => {
        console.log(response);
        this.savings = response.data;
      })
      .catch(error => console.log(error));
  }
};
</script>

<style></style>
