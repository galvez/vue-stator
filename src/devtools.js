// mostly adapted from: https://github.com/posva/pinia/blob/master/src/devtools.ts
import Vue from 'vue'

const target =
  typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
      ? global
      : { __VUE_DEVTOOLS_GLOBAL_HOOK__: undefined }

const devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

let watcher
const listeningTo = []

export function useStoreDevtools (store) {
  if (!devtoolHook) {
    return
  }

  watcher = new Vue()

  Object.assign(store, {
    _devtoolHook: devtoolHook,
    _vm: { $options: { computed: {} } },
    _mutations: {},
    replaceState: () => {}
  })

  Object.defineProperty(store, 'state', {
    get: () => store.$state
  })

  Object.defineProperty(store, 'getters', {
    get: () => store.$getters
  })

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', (targetState) => {
    // TODO: this doesnt reset keys added after targetState
    Object.assign(store.$state, targetState)
  })

  // listen for changes to emit vuex:mutations
  // dont use subscribe here as that listens with deep: true
  listen(store, store.$state)
}

function listen (store, state, parentKey = '') {
  for (const key in state) {
    const fullKey = `${parentKey}${parentKey ? '.' : ''}${key}`

    if (listeningTo.includes(fullKey)) {
      continue
    }

    listeningTo.push(fullKey)

    watcher.$watch(() => state[key], (value) => {
      if (typeof value === 'object') {
        // make sure to listen for new keys
        listen(store, state[key], fullKey)
      }

      devtoolHook.emit('vuex:mutation',
        {
          type: 'change',
          payload: {
            key: fullKey,
            value
          }
        },
        store.$state
      )
    })

    if (typeof state[key] === 'object') {
      listen(store, state[key], fullKey)
    }
  }
}
