<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="8" md="6" lg="4">
        <v-btn>
          <router-link to="/savings">
            View all savings
          </router-link>
        </v-btn>
        <v-card>
          <v-form ref="form">
            <h2>Create a new saving</h2>
            <v-text-field v-model="name" label="Name"></v-text-field>
            <v-textarea
              v-model="description"
              label="Description"
              hint="Try and convince people to actually use this saving!"
            ></v-textarea>
            <v-btn class="submit" color="primary" @click="addSaving"
              >Add saving</v-btn
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "@/axios-auth";

export default {
  data() {
    return {
      name: "",
      description: ""
    };
  },
  methods: {
    addSaving() {
      const postData = {
        Name: this.name,
        Description: this.description
      };
      console.log(postData);
      axios
        .post("/api/savings", postData)
        .then(res => {
          console.log(res.data);
          this.$refs.form.reset();
          // this.$emit("update");
        })
        .catch(error => console.log(error.response.request._response));
    }
  }
};
</script>

<style lang="scss">
form {
  padding: 20px;
  margin-top: 30px;
}

.v-btn.submit {
  margin-top: 20px;
}
</style>
