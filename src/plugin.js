import { createStore } from './store'
import mixin from './mixin'

export const injectedPropertyName = 'stator'

export function injectStator (Vue, options) {
  lazyInject(Vue, injectedPropertyName, (vm) => {
    return createStore(options, vm.$root)
  })

  injectProperty(Vue, injectedPropertyName, '$state')
  injectProperty(Vue, injectedPropertyName, '$getters')
  injectProperty(Vue, injectedPropertyName, '$actions')
}

export function lazyInject (Vue, key, setter) {
  Vue.use(() => {
    const propertyName = `$${key}`

    if (Vue.prototype.hasOwnProperty(propertyName)) {
      return
    }

    Object.defineProperty(Vue.prototype, propertyName, {
      configurable: true,
      enumerable: false,
      get () {
        if (!(key in this.$root.$options)) {
          this.$root.$options[key] = setter(this)
        }

        inject(Vue, propertyName, key)

        return this.$root.$options[key]
      }
    })
  })
}

export function inject (Vue, propertyName, key) {
  Object.defineProperty(Vue.prototype, propertyName, {
    enumerable: false,
    get () {
      return this.$root.$options[key]
    }
  })
}

export function injectProperty (Vue, propertyName, key) {
  if (Vue.prototype.hasOwnProperty(key)) {
    return
  }

  Object.defineProperty(Vue.prototype, key, {
    enumerable: true,
    get () {
      return this[`$${propertyName}`][key]
    }
  })
}

export default {
  install (Vue, options) {
    // Check if plugin not already installed
    const installKey = `__stator_installed`
    if (Vue[installKey]) {
      return
    }

    Vue[installKey] = true

    injectStator(Vue, options)

    if (options && options.mixin) {
      Vue.mixin(mixin)
    }
  }
}
