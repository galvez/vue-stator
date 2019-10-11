
# Using vue-stator in Nuxt

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

## Global state

There's only one state tree in `vue-stator`.

## Global actions

## Global getters

## Module actions

## Module getters
