# vue-stator

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]

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

```js
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

`vue-stator` introduces the **possibility of having a unified state object**.
Instead of shuffling across subdirectories looking for different state
definitions, you could now have a single place to look at: `store/state.js`.

Still, the ability to group actions and getters by a `key` is convenient.
`vue-stator` fully supports module syntax which can define their own state, getters
and/or actions.

In practice, this just means you can define **module actions** that take
**three arguments**, where the second argument is a convenience reference to
the state key corresponding to the module.

```js
import { plugin as VueStator } from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    auth: {
      user: null,
      loggedIn: false
    }
  }),
  modules: {
    auth: {
      actions: {
        login (ctx, state, user) {
          state.user = user
          state.loggedIn = false
        }
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
module namespace**

__ TBD __
In Nuxt.js, the first argument also gives you access to everything available in
Nuxt's context, such as `$axios` if you're using `@nuxtjs/axios` or `$http` if
using `@nuxt/http`.
__ /TBD __

> **Beware**: in Vuex, dispatching actions will always return a `Promise`.
>
> In `vue-stator`, that's optional. If you have code that expects an action to
> return a Promise (by following it with `.then()`, for instance), make sure to
> return `Promise.resolve()` instead. **Or**, you can also simply switch to
> `async/await` syntax and it will work just fine.

## Vuex-like helpers

```js
import { mapState, mapActions, mapGetters } from 'vue-stator'
```

`vue-stator` packs `mapState`, `mapActions` and `mapGetters`, which accept a
dictionary of method mappings, eg `(['method', 'module/namespace/method'])`

You have access to everything directly in Vue's context though.

That is, you can just reference `$state.something` in your Vue template and it'll work.

## Runtime helpers

`vue-stator` also provides some helper methods to interact with the store more easily.

- `$stator.subscribe('module/key', callback)`
To quickly subscribe to specific state updates. This uses `Vue.$watch` under the hood

- `$stator.registerModule(module, moduleName)`
To dynamically register a store module. The moduleName can be ommitted if your
module already contains a name property

- `$stator.unregisterModule(moduleName)`
To dynamically unregister a store module

```js
  beforeCreate () {
    this.$stator.registerModule({
      name: 'my/module',
      state () {
        return {
          key: true
        }
      }
    })

    // or

    this.$stator.registerModule({
      state () {
        return {
          key: true
        }
      }
    }, 'my/module')
  },
  mounted () {
    this.$state.my.module.key // true
  },
  destroyed () {
    this.$stator.unregisterModule('my/module')
  }
```

## Global getters

In a further effort to make transition from Vuex, modularized getters are
available in a similar fashion. The arguments passed to getter functions have
the exact same signature as Vuex.

```js
import { plugin as VueStator } from 'vue-stator'

Vue.use(VueStator, {
  state: () => ({
    user: {
      firstName: 'John',
      lastName: 'Doe'
    },
  }),
  modules: {
    user: {
      getters: {
        fullName (state) {
          return `${state.firstName} ${state.lastName}`
        }
      }
    }
  }
}
```

## Storage helpers

If you need your state to always be comitted to a storage provider, `vue-stator`
provides a configuration option which will automatically store and restore that
state on changes

```js
const statorConfiguration = {
  storage: {
    provider: {
      getItem (key) {
        // do something
      },
      setItem (key, value) {
        // do something
      }
    },
    namespaces: [
      'key',
      'module/key'
    ]
  }
}
```
Or if you need to use multiple storage providers

```js
const statorConfiguration = {
  storage: [
    { // object syntax
      provider () {
        if (process.client) {
          return window.localStorage
        }
      },
      namespaces: [
        'persistent-key',
        'my/module/key'
      ]
    },
    [ // array syntax
      window.sessionStorage, // this will probably fail on SSR, see object syntax
      [ 'temp-key' ]
    ]
  ]
}
```


## Nuxt.js module

> Nuxt v2.10+ is required unless you set the module option `baseDir` to something different then `store`

Using vue-stator with Nuxt.js is as easy as using it with Vuex: a store
will be automatically created by loading files placed in a conventional
locations, such as `store/state.js`.

See full documentation for the Nuxt.js
[module here](https://github.com/galvez/vue-stator/blob/master/docs/nuxt.md).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vue-stator/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/vue-stator

[npm-downloads-src]: https://img.shields.io/npm/dt/vue-stator.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/vue-stator

[circle-ci-src]: https://img.shields.io/circleci/project/github/galvez/vue-stator.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/galvez/vue-stator

[codecov-src]: https://img.shields.io/codecov/c/github/galvez/vue-stator.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/galvez/vue-stator
