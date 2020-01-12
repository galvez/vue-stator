import Vue from 'vue'
import { getPropertyByNamespace } from './namespace'

let watcher

export function setWatcher (vm) {
  watcher = vm || new Vue()
  return watcher
}

export function getWatcher () {
  return watcher
}

export function subscribe ({ $state }, namespace, callback, vm) {
  if (!watcher) {
    setWatcher(vm)
  }

  return watcher.$watch(
    () => getPropertyByNamespace($state, namespace),
    callback,
    { deep: true }
  )
}
