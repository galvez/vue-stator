// Internal utilities

export function dumpState (storage, namespace, data) {
  if (!storage) {
    return
  }
  storage.setItem(`vue-stator:${namespace}`, JSON.stringify(data))
}

export function loadState (storage, namespace, onSuccess, onError) {
  if (!storage) {
    return
  }
  try {
    const data = JSON.parse(storage.getItem(`vue-stator:${namespace}`))
    if (data) {
      onSuccess(data)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[vue-stator] error in loadState(${[...arguments].join(', ')})`, err)
  }
}
