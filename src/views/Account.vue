<template>
  <div class="accounts">
    <!-- <h1>This is the account page of id: {{account.id}}</h1> -->
    <h1>This is the account page of id: {{ $route.params.id }}</h1>
  </div>
</template>

<script>
export default {
  name: "Account",
  account: null
};
</script>

<style></style>
