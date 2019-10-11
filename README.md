# vue-stator

A lightweight, _nearly drop-in_ replacement for Vuex.

## Setup

### Vue

```
import VueStator from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    test: 123,
    auth: {
      user: null
    }
  }),
  actions: {
    incrTest (_, state) {
      state.test++
    },
    auth: {
      login (_, state, { user, pass }) {

      }
    }
  }
})
```

### Nuxt

```
export default {
  modules: ['vue-stator/nuxt']
}
```

**To Be Continued**
