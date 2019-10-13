# Vue

## Inline definitions

```
import { plugin as VueStator } from 'vue-stator'

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
        state.loggedIn = true // state here = $state.auth
        $actions.auth.postLogin() // $actions is the global actions accessor
                                  // so the `auth` namespace needs to in the path
      },
      postLogin () {
        // ...
      }
    }
  },
  getters: {
    user: {
      fullName (state) {
        // state here = $state.user
        return `${state.firstName} ${state.lastName}`
      }
    }
  }
})
```

## Loading from external files

```
import { plugin as VueStator } from 'vue-stator'
import state from '~/your-desired-location/state'
import actions from '~/your-desired-location/actions'
import getters from '~/your-desired-location/getters'

Vue.use(VueStator, { state, actions, getters })
```
