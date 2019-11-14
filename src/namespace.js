
export const namespaceSeparator = '/'

export function validateNamespace (namespace) {
  if (typeof namespace === 'string') {
    namespace = namespace.split(namespaceSeparator)
  }

  if (!Array.isArray(namespace)) {
    // TODO: warn?
    return []
  }

  return namespace.filter(Boolean)
}

export function getPropertyByNamespace (object, namespace) {
  namespace = validateNamespace(namespace)

  for (const name of namespace) {
    if (name in object) {
      object = object[name]
      continue
    }

    // TODO: warn on else?
  }

  return object
}

export function setPropertyByNamespace (object, namespace, value) {
  namespace = validateNamespace(namespace)

  const key = namespace.pop()

  for (const name of namespace) {
    if (name in object) {
      object = object[name]
      continue
    }

    // TODO: warn on else?
  }

  object[key] = value

  return object[key]
}

export function getModuleByNamespace (store, namespace) {
  namespace = validateNamespace(namespace)

  let object = {
    state: store.$state,
    getters: store.$getters,
    actions: store.$actions
  }

  for (const name of namespace) {
    if (!object.state[name]) {
      object.state[name] = {}
    }

    if (!object.getters[name]) {
      object.getters[name] = {}
    }

    if (!object.actions[name]) {
      object.actions[name] = {}
    }

    object = {
      state: object.state[name],
      getters: object.getters[name],
      actions: object.actions[name]
    }
  }

  return object
}
