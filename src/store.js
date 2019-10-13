import Vue from 'vue'
import { $set } from './helpers'
import { loadState, dumpState } from './storage'
import { subscribe } from './watcher'

export function createStore ({
  ctx,
  state,
  actions,
  getters,
  hydrate,
  localStorage,
  sessionStorage
}) {
  const initialState = state(ctx)

  if (ctx._isVue) {
    ctx = {}
  }

  if (localStorage) {
    for (const namespace of localStorage) {
      loadState(window.localStorage, state, data => $set(ctx.$state, namespace, data))
      subscribe(ctx, namespace, snapshot => dumpState(window.localStorage, namespace, snapshot))
    }
  }

  if (sessionStorage) {
    for (const namespace of sessionStorage) {
      loadState(window.sessionStorage, state, data => $set(ctx.$state, namespace, data))
      subscribe(ctx, namespace, snapshot => dumpState(window.sessionStorage, namespace, snapshot))
    }
  }

  if (hydrate) {
    ctx.$state = hydrate(initialState)
  } else {
    ctx.$state = Vue.observable(initialState)
  }

  if (getters) {
    ctx.$getters = {}
    registerGetters(ctx, getters)
  }
  if (actions) {
    ctx.$actions = {}
    registerActions(ctx, actions)
  }
  return ctx
}

// Registration helpers

export function registerGetters (ctx, getters) {
  ctx.$getters = {}
  for (const key in getters) {
    if (typeof getters[key] === 'function') {
      Object.defineProperty(ctx.$getters, key, {
        get: () => getters[key](ctx.$state, ctx.$getters)
      })

      continue
    }

    ctx.$getters[key] = {}
    for (const subKey in getters[key]) {
      Object.defineProperty(ctx.$getters[key], subKey, {
        get: () => getters[key](ctx.$state[key], ctx.$getters[key], ctx.$state)
      })
    }
  }
  return ctx.$getters
}

export function registerActions (ctx, actions) {
  ctx.$actions = {}
  for (const key in actions) {
    if (typeof actions[key] === 'function') {
      ctx.$actions[key] = function (...args) {
        return actions[key](ctx, ctx.$state, ...args)
      }

      continue
    }

    ctx.$actions[key] = {}
    for (const subKey in actions[key]) {
      ctx.$actions[key][subKey] = function (...args) {
        return actions[key][subKey](ctx, ctx.$state[key], ...args)
      }
    }
  }
  return ctx.$actions
}
