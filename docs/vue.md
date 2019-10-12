# Vue

## Inline definitions

```
import VueStator from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    test: 123,
    auth: {
      loggedIn: false
    },
    user: {
      firstName: 'John',
      lastName: 'Doe
    },
  }),
  actions: {
    incrTest ({ $state }) {
      $state.test++
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

## Loading from external files

```
import VueStator from 'vue-stator'
import state from '~/your-desired-location/state'
import actions from '~/your-desired-location/actions'
import getters from '~/your-desired-location/getters'

Vue.use(VueStator, { state, actions, getters })
```
