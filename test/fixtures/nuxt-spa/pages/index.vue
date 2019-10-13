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
    this.$actions.user.update({
      firstName: 'Pim',
      lastName: 'lie'
    })
  }
}
</script>
