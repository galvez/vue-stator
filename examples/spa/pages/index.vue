<template>
  <div>
    <p>{{ $state.test }}</p>
    <p>{{ $getters.userFullName }}</p>
  </div>
</template>

<script>
export default {
  created () {
    this.$actions.user.update({
      firstName: 'Jonas',
      lastName: 'Galvez',
    })
  }
}
</script>