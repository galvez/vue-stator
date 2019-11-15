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

export function map (properties, assignMapping) {
  const mapped = {}

  if (typeof properties !== 'object') {
    properties = ensureArray(properties)
  }

  if (Array.isArray(properties)) {
    for (const prop of properties) {
      mapped[prop] = assignMapping(prop)
    }

    return mapped
  }

  for (const propName in properties) {
    mapped[propName] = assignMapping(properties[propName])
  }

  return mapped
}

export function mapState (namespacedProperties) {
  return map(namespacedProperties, prop => ({
    get () {
      return getPropertyByNamespace(this.$state, prop)
    },
    set (value) {
      return setPropertyByNamespace(this.$state, prop, value)
    }
  }))
}

export function mapGetters (namespacedProperties) {
  return map(namespacedProperties, (prop) => {
    return function (...args) {
      return getPropertyByNamespace(this.$getters, prop)
    }
  })
}

export function mapActions (namespacedProperties) {
  return map(namespacedProperties, (prop) => {
    return function (...args) {
      const action = getPropertyByNamespace(this.$actions, prop)
      if (action) {
        return action(...args)
      }
    }
  })
}
