import Vue from 'vue'
import consola from 'consola'
import $get from 'lodash.get'

// Internal utilities

function _isPureObject (val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

function _dumpState (storage, namespace, data) {
  if (!storage) {
    return
  }
  try {
    storage.setItem(`vue-stator:${namespace}`, JSON.stringify(data))
  } catch (err) {
    consola.error('dumpState():', err)
  }
}

function _loadState (storage, namespace, onSuccess, onError) {
  if (!storage) {
    return
  }
  try {
    const data = JSON.parse(storage.getItem(`vue-stator:${namespace}`))
    if (data) {
      onSuccess(data)
    }
  } catch (err) {
    onError(err)
  }
}

let _watcher

export function _subscribe (ctx, path, callback) {
  if (!_watcher) {
    _watcher = new Vue()
  }
  return _watcher.$watch(
    () => $get(ctx.$state, path),
    data => callback(data),
    { deep: true }
  )
}

// Public helpers

export function $set (...args) {
  Vue.set(...args)
}

export function $delete (...args) {
  Vue.delete(...args)
}

export function mapState (namespace, properties) {
  if (Array.isArray(namespace)) {
    return namespace.reduce((mapped, prop) => {
      mapped[prop] = {
        get () {
          return this.$state[prop]
        },
        set (value) {
          this.$state[prop] = value
          return this.$state[prop]
        },
      }
      return mapped
    }, {})
  }
  return properties.reduce((mapped, prop) => {
    mapped[prop] = {
      get () {
        return this.$state[namespace][prop]
      },
      set (value) {
        this.$state[namespace][prop] = value
        return this.$state[prop]
      },
    }
    return mapped
  }, {})
}

export function mapActions (namespace, properties) {
  if (Array.isArray(namespace)) {
    return namespace.reduce((mapped, prop) => {
      mapped[prop] = function (...args) {
        return this.$actions[prop](...args)
      }  
      return mapped
    }, {})
  }
  return properties.reduce((mapped, prop) => {
    mapped[prop] = function (...args) {
      return this.$actions[namespace][prop](...args)
    }
    return mapped
  }, {})
}

export function mapGetters (namespace, getters) {
  if (Array.isArray(namespace)) {
    return namespace.reduce((mapped, getter) => {
      mapped[getter] = function () {
        return this.$getters[getter]
      }
      return mapped
    }, {})
  }
  return getters.reduce((mapped, getter) => {
    mapped[getter] = function () {
      return this.$getters[namespace][getter]
    }
    return mapped
  }, {})
}

export async function createStore ({
  ctx,
  state,
  actions,
  getters,
  hydrate,
  localStorage,
  sessionStorage
}) {
  const initialState = await state(ctx)
  // Determine possible namespaces
  ctx._stator_namespaces = Object.entries(initialState)
    .filter(([_, value]) => _isPureObject(value))
    .map(([key]) => key)

  if (localStorage) {
    for (const namespace of localStorage) {
      _loadState(window.localStorage, state, (data) => $set(ctx.$state, namespace, data))
      _subscribe(ctx, namespace, (snapshot) => _dumpState(window.localStorage, namespace, snapshot))
    }
  }

  if (sessionStorage) {
    for (const namespace of sessionStorage) {
      _loadState(window.sessionStorage, state, (data) => $set(ctx.$state, namespace, data))
      _subscribe(ctx, namespace, (snapshot) => _dumpState(window.sessionStorage, namespace, snapshot))
    }
  }

  if (hydrate) {
    ctx.$state = await hydrate(initialState)
  } else {
    ctx.$state = Vue.observable(initialState)
  }
  if (getters) {
    registerGetters(ctx, getters)
  }
  if (actions) {
    registerActions(ctx, actions)
  }
}

// Registration helpers

export function registerGetters (ctx, getters) {
  for (const key of Object.keys(getters)) {
    if (ctx._stator_namespaces.includes(key)) {
      for (const subKey of Object.keys(getters[key])) {
        Object.defineProperty(ctx.$getters[key], subKey, {
          get: () => getters[key](ctx.$state[key], ctx.$getters[key], ctx.$state),
        })
      }
      continue
    }
    Object.defineProperty(ctx.$getters, key, {
      get: () => getters[key](ctx.$state, ctx.$getters),
    })
  }
}

export function registerActions (ctx, actions) {
  for (const key of Object.keys(actions)) {
    if (ctx._stator_namespaces.includes(key)) {
      for (const subKey of Object.keys(actions[key])) {
        ctx.$actions[key][subKey] = function (...args) {
          return actions[key][subKey] (ctx, ctx.$state[key], ...args)
        }    
      }
      continue
    }
    ctx.$actions[key] = function (...args) {
      return actions[key] (ctx, ctx.$state, ...args)
    }
  }
}

// Vanilla Installer

function injectLazy (Vue, key, setter) {
  // Check if plugin not already installed
  const installKey = '__stator_lazy_' + key + '_installed__'
  if (Vue[installKey]) {
    return
  }
  Vue[installKey] = true
  // Call Vue.use() to install the plugin into vm
  Vue.use(() => {
    if (!Vue.prototype.hasOwnProperty(key)) {
      Object.defineProperty(Vue.prototype, key, {
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

export function install (Vue, options = {}) {
  injectLazy(Vue, '_stator', (vm) => {
    return createStore({ ctx: vm, ...options })
  })
  injectLazy(Vue, '$state', (vm) => vm._stator.$state)
  injectLazy(Vue, '$getters', (vm) => vm._stator.$getters)
  injectLazy(Vue, '$actions', (vm) => vm._stator.$actions)
}
