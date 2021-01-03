<template>
  <div class="households">
    <h1>This is the households page</h1>
    <HouseholdList />
  </div>
</template>

<script>
import HouseholdList from "@/components/Households/HouseholdList";
export default {
  name: "Households",
  components: {
    HouseholdList
  }
};
</script>

<style></style>
