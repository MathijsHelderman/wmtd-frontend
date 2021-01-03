<template>
  <div class="notfound">
    <Header />
    <h1>Whoops, could not find this page!</h1>
    <transition name="fadeUp" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "NotFound",
  components: [Header]
};
</script>

<style scoped>
h1 {
  color: red;
}
</style>
