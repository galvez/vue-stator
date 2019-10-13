import Vue from 'vue'

let watcher

export function subscribe ({ $state }, key, callback) {
  if (!watcher) {
    watcher = new Vue()
  }

  return watcher.$watch(() => $state[key], callback, { deep: true })
}
