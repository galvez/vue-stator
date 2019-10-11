### Vue

```
import VueStator from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    test: 123,
    auth: {
      loggedIn: false
    }
  }),
  actions: {
    incrTest ({ $state }) {
      $state.test++
    },
    user: {
      firstName: 'John',
      lastName: 'Doe
    },
    auth: {
      login ({ $actions }, state) {
        state.loggedIn = true
        $actions.postLogin()
      },
      postLogin () {
        // ...
      }
    }
  },
  getters: {
    user: {
      fullName (state) {
        return `${state.firstName} ${state.lastName}`
      }
    }
  }
})
```