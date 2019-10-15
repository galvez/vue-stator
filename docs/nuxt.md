
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

