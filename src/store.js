import Vue from 'vue'
import { namespaceSeparator, getModuleByNamespace } from './namespace'
import { registerStorage } from './storage'
import { setWatcher, subscribe } from './watcher'
import { callIfFunction } from './utils'

export function createStore ({
  state,
  hydrate,
  actions,
  getters,
  modules,
  storage
}, vm) {
  if (vm) {
    setWatcher(vm)
  }

  let initialState = state ? callIfFunction(state) : {}

  if (hydrate) {
    initialState = hydrate(initialState)
  }

  const store = {
    $state: Vue.observable(initialState),
    $getters: {},
    $actions: {},
    subscribe: (...args) => subscribe(store, ...args),
    registerModule: (module, namespace) => {
      const moduleName = module.name

      if (!moduleName) {
        throw new Error('module name is required when registering an object')
      }

      delete module.namespaced
      registerModule(store, namespace, module, moduleName)
    },
    unregisterModule: (moduleName) => {
      unregisterModule(store, moduleName)
    }
  }

  register(store, {
    state: store.$state,
    getters: store.$getters,
    actions: store.$actions
  }, { getters, actions, modules }, true)

  if (storage) {
    registerStorage(store, storage)
  }

  return store
}

// Registration helpers

export function register (store, parent, { getters, actions, modules }, isRoot) {
  registerGetters(store, parent, getters)
  registerActions(store, parent, actions)

  if (!modules) {
    return
  }

  for (const moduleName in modules) {
    // this is to support a flattened module object
    // TODO: should we order moduleNames by length? Cause now the user needs
    // to register the module 'user' before 'user/profile'
    if (isRoot && moduleName.includes(namespaceSeparator)) {
      registerModule(store, moduleName, modules[moduleName])
      continue
    }

    registerModule(store, parent, modules[moduleName], moduleName)
  }
}

export function registerModule (store, parent, module, moduleName) {
  // for supporting runtime module registration
  if (typeof parent === 'string') {
    parent = parent.split(namespaceSeparator)
  }

  if (Array.isArray(parent)) {
    moduleName = moduleName || parent.pop()
    parent = getModuleByNamespace(store, parent)
  }

  // namespaced is the default, only dont namespace
  // when its explicitly set to falsy
  let moduleParent
  if (!('namespaced' in module) || module.namespaced) {
    const moduleState = registerState(parent, moduleName, module)

    // if parent has getter/action with same
    // name as this module, the module has preference
    // TODO: should we warn about this?
    parent.getters[moduleName] = {}
    parent.actions[moduleName] = {}

    moduleParent = {
      state: moduleState,
      getters: parent.getters[moduleName],
      actions: parent.actions[moduleName]
    }
  }

  register(store, moduleParent || parent, module)
}

export function unregisterModule (store, parent) {
  if (typeof parent === 'string') {
    parent = parent.split(namespaceSeparator)
  }

  if (!Array.isArray(parent)) {
    // TODO: throw error?
    return
  }

  const moduleName = parent.pop()
  parent = getModuleByNamespace(store, parent)

  for (const key of ['state', 'getters', 'actions']) {
    if (parent[key][moduleName]) {
      delete parent[key][moduleName]
    }
  }
}

export function registerState ({ state: parent }, namespace, { state }) {
  if (!state) {
    // this allows to use an unified state file
    return parent[namespace] || parent
  }

  // TODO: check if not fn on ssr and print warning?
  // TODO: what about hook so users can manually clone the state here?
  Vue.set(parent, namespace, callIfFunction(state))

  return parent[namespace]
}

export function registerGetters (store, { state, getters: parent }, getters) {
  if (!getters) {
    return
  }

  for (const key in getters) {
    if (typeof getters[key] !== 'function') {
      // TODO: huh, why are we here?
      continue
    }

    Object.defineProperty(parent, key, {
      get: () => getters[key](state, parent, store.$state, store.$getters)
    })
  }
}

export function registerActions (store, { state, getters, actions: parent }, actions) {
  if (!actions) {
    return
  }

  for (const key in actions) {
    if (typeof actions[key] !== 'function') {
      // TODO: huh, why are we here?
      continue
    }

    // We dont add the root state here, they can already be accessed through
    // this.$state and not adding it here is a small perf benefit
    const ctx = {
      state,
      getters,
      actions: parent
    }

    parent[key] = (...args) => actions[key].call(store, ctx, ...args)
  }
}
