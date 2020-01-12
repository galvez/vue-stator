<template>
  <div>
    <nuxt-link to="/about">About</nuxt-link>

    <p class="state">{{ $state.test }}</p>
    <p class="getter">{{ $getters.userFullName }}</p>
  </div>
</template>

<script>
export default {
  created () {
    // Testing SSR state change
    this.$actions.user.update({
      firstName: 'Jonas',
      lastName: 'Galvez'
    })
  }
}
</script>
