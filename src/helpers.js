import Vue from 'vue'
import {
  getPropertyByNamespace,
  setPropertyByNamespace
} from './namespace'
import { ensureArray } from './utils'

// Public helpers

export function $set (...args) {
  Vue.set(...args)
}

export function $delete (...args) {
  Vue.delete(...args)
}

export function mapState (namespacedProperties) {
  const mapped = {}

  for (const prop of ensureArray(namespacedProperties)) {
    mapped[prop] = {
      get () {
        return getPropertyByNamespace(this.$state, prop)
      },
      set (value) {
        return setPropertyByNamespace(this.$state, prop, value)
      }
    }
  }

  return mapped
}

export function mapGetters (namespacedProperties) {
  const mapped = {}

  for (const prop of ensureArray(namespacedProperties)) {
    mapped[prop] = function (...args) {
      return getPropertyByNamespace(this.$getters, prop)
    }
  }

  return mapped
}

export function mapActions (namespacedProperties) {
  const mapped = {}

  for (const prop of ensureArray(namespacedProperties)) {
    mapped[prop] = function (...args) {
      const action = getPropertyByNamespace(this.$actions, prop)
      if (action) {
        return action(...args)
      }

      // TODO: warn?
    }
  }

  return mapped
}
