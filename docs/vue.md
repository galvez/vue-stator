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