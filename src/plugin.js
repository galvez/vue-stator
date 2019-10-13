import { createStore } from './store'

// Vanilla Installer

function lazyInject (Vue, key, setter) {
  // Check if plugin not already installed
  const installKey = `__stator_${key}_installed`
  if (Vue[installKey]) {
    return
  }

  Vue[installKey] = true

  // Call Vue.use() to install the plugin into vm
  Vue.use(() => {
    if (!Vue.prototype.hasOwnProperty(key)) {
      Object.defineProperty(Vue.prototype, key, {
        configurable: true,
        get () {
          this.$root.$options[key] = setter(this)
          Object.defineProperty(Vue.prototype, key, {
            get () {
              return this.$root.$options[key]
            }
          })
          return this.$root.$options[key]
        }
      })
    }
  })
}

export default {
  install (Vue, options) {
    lazyInject(Vue, '_stator', (vm) => {
      return createStore({ ctx: vm, ...options })
    })
    lazyInject(Vue, '$state', vm => vm._stator.$state)
    lazyInject(Vue, '$getters', vm => vm._stator.$getters)
    lazyInject(Vue, '$actions', vm => vm._stator.$actions)
  }
}
