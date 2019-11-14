import Vue from 'vue'
import { getPropertyByNamespace } from './namespace'

let watcher

export function setWatcher (vm) {
  watcher = vm
}

export function subscribe ({ $state }, namespace, callback, vm) {
  if (!watcher) {
    setWatcher(vm || new Vue())
  }

  return watcher.$watch(
    () => getPropertyByNamespace($state, namespace),
    callback,
    { deep: true }
  )
}
