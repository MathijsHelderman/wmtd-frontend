<template>
  <div class="home">
    <div v-if="!this.$store.getters.isAuthenticated">
      <Login />
    </div>
    <div v-if="this.$store.getters.isAuthenticated">
      <Logout />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";

export default {
  name: "Home",
  components: {
    Login,
    Logout
  }
};
</script>
