<template>
  <div>
    <p>{{ $state.test }}</p>
    <p>{{ $getters.userFullName }}</p>
  </div>
</template>

<script>
export default {
  fetch ({ $actions }) {
    // Testing SSR state change
    $actions.user.update({
      firstName: 'Jonas',
      lastName: 'Galvez',
    })
  }
}
</script>