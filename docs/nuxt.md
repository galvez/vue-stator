
# Using vue-stator in Nuxt.js

## Setup

List the `vue-stator/nuxt` module under `buildModules` in `nuxt.config.js`:

```
export default {
  buildModules: [`vue-stator/nuxt`]
}
```

Note that the default behavior for loading files under the `store` dir will
change. There are three key files you can set under `store` now:

- `store/state.js` - global state function
- `store/actions.js` - global getter exports
- `store/getters.js` - global getter exports

## Module options

#### `baseDir`
_string_ ( default: `store`)

> When using Nuxt v2.9 or lower changing this option is required, otherwise Nuxt will add a Vuex store anyway

Customise the folder containing your state, actions and getters files

#### `disableVuex`
_boolean_ ( default: `true`)

Set this to `false` if you want Vuex and vue-stator to be both included in your project.

#### `inject`
_Array<string>_ or _Function_

You can either provide an array of context properties which should be injected into the store or provide a function. The injected properties will be made available on the VueStator store which is accessible as the `this` context of an action.

Properties provided by an array will be automatically prefixed with a `$`, use the function syntax if you need more control

The inject method will receive three arguments: the store, the Nuxt.js context and the Vue import. The Vue import is needed due to the method being serialized so you can still use Vue.nextTick

> Note: when providing a function this function will be serialized in to the plugin template. This means you cannot use variables outside of its own scope (hence why Vue is provided as 3rd arg)

## Global state

There's only one state tree definition in `vue-stator`.

This file must exist as `store/state.js` and export a default function
that returns an object.

## Global actions

Global actions can be exported from `store/actions.js`.

## Global getters

Global actions can be exported from `store/getters.js`.

## Module actions and getters

As explained in the main README, the concept of store modules is _virtually
supported_, that is, namespaced **actions** and **getters** simply get a
contextual `state` argument relative to the state key matching the namespace.

Module actions can be exported from:

- `store/<namespace>.js` or
- `store/<namespace>/actions.js`.

## Module getters

If you want to use store module getters, you must place them in:

- `store/<namespace>/getters.js`.

Since defining actions tends to be more common than defining getters,
`vue-stator` reserves the `store/<namespace>.js` convention for actions
only (see previous topic).


## Injecting properties into the store

In a Nuxt.js application with a Vuex-store, Nuxt.js will create the store before any plugins are loaded. Then when any plugin injects a property on the context, that property is also set on the Vuex store.

Because vue-stator runs as a Nuxt.js module and there is no way to hook into Nuxt.js's inject method, you need to manually configure which properties you wish to inject into the store

```js
  buildModules: [{
    src: 'vue-stator/nuxt',
    options: {
      inject: ['axios'], // quick method of inject $axios
      inject (stator, context, Vue) { // or use a function to have granular control
        Vue.nextTick().then(() => {
          stator.$http = context.$http
        })
      }
    }
  }],

```

### Race condition due to plugin order

The reason we use `Vue.nextTick().then` in the example above is to overcome an issue due to the order in which plugins are loaded.
We can only inject a property when that property has already bene injected by its corresponding plugin. `Vue.nextTick().then` runs _after_ all the plugin methods have been called.

> Note: providing a callback to _Vue.nextTick(callback)_ wont work, we need to use a Promise

> Note 2: If a plugin injects properties using nextTick itself, then `Vue.nextTick().then` could not be sufficient
