<template>
  <div>
    <nuxt-link to="/">Home</nuxt-link>

    <p class="state">{{ $state.test }}</p>
    <p class="getter">{{ $getters.userFullName }}</p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$state.test = Math.round(Math.random() * 100)
  }
}
</script>
