<template>
  <div class="savings">
    <h1>Savings</h1>
    <transition name="fadeUp" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Savings",
  components: {}
};
</script>

<style lang="scss">
h1 {
  margin-top: 30px;
}
.v-btn {
  background-color: rgb(185, 218, 216) !important;
  opacity: 0.8;

  a {
    text-decoration: none;
    color: black;
  }
}
</style>
