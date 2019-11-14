# Vue

See our fixture for the [` Vue Server-Side Rendering`](../test/fixtures/vue-ssr) test for a working example

## Inline definitions

```js
import { plugin as VueStator } from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    test: 123,
    user: {
      firstName: 'John',
      lastName: 'Doe'
    },
  }),
  actions: {
    incrTest ({ $state }) {
      $state.test++
    }
  },
  modules: {
    auth: {
      state: {
        loggedIn: false
      },
      actions: {
        login ({ $actions }, state) {
          state.loggedIn = true // state here = $state.auth
          $actions.auth.postLogin() // $actions is the global actions accessor
                                    // so the `auth` namespace needs to in the path
        },
        postLogin () {
          // ...
        }
      }
    }
  },
  modules: {
    user: {
      namespaced: true,
      getters: {
        fullName (state) {
          // state here = $state.user
          return `${state.firstName} ${state.lastName}`
        }
      }
    }
  }
})
```

or pass the store as prop of your app

```js
import { plugin as VueStator, createStore } from 'vue-stator'

Vue.use(VueStator)

const stator = createStore({ /* stator config */ })

new Vue({
  router,
  stator,
  template: `<h1>Hello World</h1`
}).$mount('#app')
```

## Loading from external files

```js
import { plugin as VueStator } from 'vue-stator'
import state from '~/your-desired-location/state'
import actions from '~/your-desired-location/actions'
import getters from '~/your-desired-location/getters'
import modules from '~/your-desired-location/modules'

Vue.use(VueStator, { state, actions, getters, modules })
```
