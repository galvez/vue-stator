# vue-stator

A lightweight, _nearly drop-in_ replacement for Vuex.

```
npm i vue-stator --save
```

See documentation for 
[Vue.js](https://github.com/galvez/vue-stator/blob/master/docs/vue.md)
or
[Nuxt.js](https://github.com/galvez/vue-stator/blob/master/docs/nuxt.md).

_Stator is the stationary part of the [rotary system](https://en.wikipedia.org/wiki/Rotary_system)_ - thanks to [@pimlie](https://github.com/pimlie) for the awesome name suggestion.

## No more mutations

`vue-stator` uses `Vue.observable()` under the hood, which means assignments and
Array changes will automatically trigger updates. So instead of actions and
mutations, `vue-stator` **only lets you define actions**. To make transition
from Vuex easy, it introduces a new function signature for actions that help
making them look like mutations if needed.

Say you have a `store/actions.js` file defining global actions:

```
export function myAction ({ $state, $actions }, param) {
  $state.param = param // mutates!
  $actions.otherAction()
}

export function otherAction ({ $state }, param) {
  $state.paramDoubled = param * 2 // mutates!
}
```

The first parameter is the context (which can be a Vue.js instance or the Nuxt.js
context object). You can use it to access the global `$state`, `$actions` and 
`$getters`, and in the case of Nuxt.js, also everything in its own context.

## Unified state and modularization

`vue-stator` introduces the **constraint of having a unified state object**. 
Instead of shuffling across subdirectories looking for different state 
definitions, you now have a single place to look at: `store/state.js`.

Still, the ability to group actions and getters by a `key` is convenient.
`vue-stator` will consider any top-level key in the state that is a pure
object to be a module.

In practice, this just means you can define **module actions** that take
**three arguments**, where the second argument is a convenience reference to
the state key corresponding to the module.

```
import VueStator from 'vue-stator'

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

Notice how `state` is a direct reference to `$state.auth`. The first argument 
(`ctx`) gives you access to `$state` (global), `$actions` and `$getters`. So, 
to recap:

- `$state` _available in_ the first argument: **the root state**
- `state` _passed as_ the second argument: **the state key that matches the 
action namespace**

In Nuxt.js, the first argument also gives you access to everything available in
Nuxt's context, such as `$axios` if you're using `@nuxtjs/axios` or `$http` if
using `@nuxt/http`.

> **Beware**: in Vuex, dispatching actions will always return a `Promise`. In 
> `vue-stator`, that's optional. If you have code that expects an action to
> return a Promise (by following it with `.then()`, for instance), make sure to
> return `Promise.resolve()` instead. **Or**, you can also simply switch to
> `async/await` syntax and it will work just fine (without `.then()`).

## Vuex-like helpers

```js
import { mapState, mapActions, mapGetters } from 'vue-stator'
```

`vue-stator` packs `mapState`, `mapActions` and `mapGetters`, with the caveat 
that they won't accept a dictionary of method mappings, only `(['method', ...])` 
or `('namespace', ['method', ...])`.

You have access to everything directly in Vue's context though.

That is, you can just reference `$state.something` in your Vue template and it'll work.

## Global getters

In a further effort to make transition from Vuex, modularized getters are
available in a similar fashion. The arguments passed to getter functions have
the exact same signature as Vuex.

```
import VueStator from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    user: {
      firstName: 'John',
      lastName: 'Doe
    },
  }),
  getters: {
    user: {
      fullName (state) {
        return `${state.firstName} ${state.lastName}`
      }
    }
  }
}
```

## Nuxt.js module

Using vue-stator with Nuxt.js is as easy as using it with Vuex: a store
will be automatically created by loading files placed in a conventional 
locations, such as `store/state.js`.

See full documentation for the Nuxt.js
[module here](https://github.com/galvez/vue-stator/blob/master/docs/nuxt.md).
