import Vue from 'vue'
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
        }
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
      }
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
