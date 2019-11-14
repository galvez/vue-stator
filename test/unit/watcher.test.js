import Vue from 'vue'

jest.mock('vue')

describe('watcher', () => {
  afterEach(() => jest.resetAllMocks())

  test('subscriber sets a watcher when not set', () => {
    let watcherModule
    jest.isolateModules(() => {
      watcherModule = require('~/watcher')
    })

    watcherModule.subscribe({ $state: {} }, 'key')
    expect(Vue).toHaveBeenCalledTimes(1)
  })

  test('subscriber sets watcher passed as arg', () => {
    let watcherModule
    jest.isolateModules(() => {
      watcherModule = require('~/watcher')
    })

    const watcher = jest.fn()

    watcherModule.subscribe({ $state: {} }, 'key', () => {}, { $watch: watcher })
    expect(Vue).not.toHaveBeenCalled()
    expect(watcher).toHaveBeenCalledTimes(1)
  })

  test('subscriber doesnt set watcher when already set', () => {
    let watcherModule
    jest.isolateModules(() => {
      watcherModule = require('~/watcher')
    })

    const watcher = jest.fn()
    watcherModule.setWatcher({ $watch: watcher })

    watcherModule.subscribe({ $state: {} }, 'key')
    expect(Vue).not.toHaveBeenCalled()
    expect(watcher).toHaveBeenCalledTimes(1)
  })
})
