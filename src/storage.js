import { $set } from './helpers'
import { logScope, logger } from './logger'
import { callIfFunction } from './utils'
import { subscribe } from './watcher'

export function validateStorage (storage) {
  if (storage instanceof Storage) {
    return true
  }

  if (typeof storage.getItem !== 'function') {
    return false
  }

  if (typeof storage.setItem === 'function') {
    return true
  }

  return false
}

// Internal utilities
export function dumpState (storage, namespace, data) {
  /* istanbul ignore next */
  if (!storage) {
    return
  }

  storage.setItem(`vue-stator:${namespace}`, JSON.stringify(data))
}

export function loadState (storage, namespace, onSuccess, onError) {
  /* istanbul ignore next */
  if (!storage) {
    return
  }

  try {
    const data = JSON.parse(storage.getItem(`vue-stator:${namespace}`))
    onSuccess(data)
  } catch (err) {
    logger.error(`${logScope} Error in loadState(${[...arguments].join(', ')})`, err)

    if (onError) {
      onError(err)
    }
  }
}

export function registerStorage (store, storage) {
  if (!Array.isArray(storage)) {
    storage = [storage]
  }

  for (const shelf of storage) {
    let provider
    let namespaces

    if (Array.isArray(shelf)) {
      [provider, namespaces] = shelf
    } else {
      ({ storage: provider, namespaces } = shelf)
    }

    provider = callIfFunction(provider)

    if (!validateStorage(provider)) {
      // TODO: warn?
      continue
    }

    // TODO: multiple depth support
    for (const namespace of namespaces) {
      loadState(provider, namespace, data => $set(store.$state, namespace, data))
      subscribe(store, namespace, snapshot => dumpState(provider, namespace, snapshot))
    }
  }
}
