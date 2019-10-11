![50539530-e780e800-0b68-11e9-9453-e066015d0c2a](https://user-images.githubusercontent.com/12291/66621138-68b9e080-ebb9-11e9-851d-a8e18e213a10.png)

# vue-stator

A lightweight, _nearly drop-in_ replacement for Vuex.

See documentation for 
[Vue.js](https://github.com/galvez/vue-stator/blob/master/docs/vue.md)
or
[Nuxt.js](https://github.com/galvez/vue-stator/blob/master/docs/nuxt.md).

## No more mutations

`vue-stator` uses `Vue.observable()` under the hood, which means assignments and
Array changes will automatically trigger updates. So instead of actions and
mutations, `vue-stator` **only lets you define actions**. To make transition
from Vuex easy, it introduces a new function signature for actions that help
making them look like mutations if needed.

Say you have a `store/actions.js` file defining global actions:

```
export function myAction ({ $state, $actions }, param) {
  $state.param = param
  $actions.otherAction()
}

export function otherAction ({ $state }, param) {
  $state.paramDoubled = param * 2
}
```

The first parameter is the context (which can be a Vue.js instance or the Nuxt.js context object). You can use it to access the global $state`, `$actions`, 

## Unified state and modularization

`vue-stator` introduces the **constraint of having a unified state object**. Instead of shuffling across subdirectories looking for different state definitions, you now have a single place to look at: `store/state.js`.

Still, the ability to group actions and getters by a `key` is convenient. `vue-stator` will consider any top-level key in the state that is a pure object to be a module.

In practice, this just menas you can define **module actions** that take **three arguments**, where the second argument is a convenience reference to the state key corresponding to the module.

```
Vue.use(VueStator, {
  state: () => ({
    auth: {
      user: null,
      loggedIn: false
    }
  }),
  actions: {
    auth: {
      login (ctx, state, user) {
        state.user = user
        state.loggedIn = false
      }
    }
  }
}
```

`ctx` gives you access to `$state`, `$actions` and `$getters`.

In Nuxt.js, it also gives you access to everything available in Nuxt's context, such as `$axios`.
