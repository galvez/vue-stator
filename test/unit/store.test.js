import Vue from 'vue'
import * as storage from '~/storage'
import * as store from '~/store'
import * as watcher from '~/watcher'

describe('store', () => {
  test('creates basic store', () => {
    jest.spyOn(watcher, 'setWatcher').mockImplementation(_ => _)

    const vm = {}
    const config = {
      state: {
        name: 'test'
      },
      getters: {
        doublename (state) {
          return `${state.name}${state.name}`
        }
      },
      actions: {
        setName (_, state, newName) {
          state.name = newName
        }
      }
    }

    const stator = store.createStore(config, vm)

    expect(stator.$state.name).toBe('test')
    expect(stator.$getters.doublename).toBe('testtest')

    stator.$actions.setName('other')

    expect(stator.$state.name).toBe('other')
    expect(stator.$getters.doublename).toBe('otherother')

    expect(watcher.setWatcher).toHaveBeenCalledTimes(1)
    expect(watcher.setWatcher).toHaveBeenCalledWith(vm)
  })

  test('hydrates state store', () => {
    const config = {
      state: {
        name: 'test'
      },
      hydrate () {
        return {
          name: 'hydrated'
        }
      }
    }

    const stator = store.createStore(config)

    expect(stator.$state.name).toBe('hydrated')
  })

  test('creates store with only module', () => {
    const config = {
      modules: {
        my: {
          state: {
            name: 'test'
          },
          getters: {
            doublename (state) {
              return `${state.name}${state.name}`
            }
          },
          actions: {
            setName (_, state, newName) {
              state.name = newName
            }
          }
        },
        'my/module': {
          state: {
            name: 'test'
          }
        }
      }
    }

    const stator = store.createStore(config)

    expect(stator.$state.my.name).toBe('test')
    expect(stator.$getters.my.doublename).toBe('testtest')
    expect(stator.$state.my.module.name).toBe('test')

    stator.$actions.my.setName('other')

    expect(stator.$state.my.name).toBe('other')
    expect(stator.$getters.my.doublename).toBe('otherother')
  })

  test('dynamically registers & unregisters module using store methods', () => {
    const config = {}
    const module = {
      name: 'module',
      state: {
        name: 'test'
      },
      getters: {
        doublename (state) {
          return `${state.name}${state.name}`
        }
      },
      actions: {
        setName (_, state, newName) {
          state.name = newName
        }
      }
    }

    const stator = store.createStore(config)
    stator.registerModule(module, 'my')

    expect(stator.$state.my.module.name).toBe('test')
    expect(stator.$getters.my.module.doublename).toBe('testtest')
    stator.$actions.my.module.setName('other')
    expect(stator.$state.my.module.name).toBe('other')

    stator.unregisterModule('my/module')

    // TODO: the my module is left behind even though it didnt exist initially
    expect(stator.$state.my.module).toBeUndefined()
    expect(stator.$getters.my.module).toBeUndefined()
    expect(stator.$actions.my.module).toBeUndefined()
  })

  test('dynamically registers & unregisters module using imports', () => {
    const config = {}
    const module = {
      state: {
        name: 'test'
      },
      getters: {
        doublename (state) {
          return `${state.name}${state.name}`
        }
      },
      actions: {
        setName (_, state, newName) {
          state.name = newName
        }
      }
    }

    const stator = store.createStore(config)
    store.registerModule(stator, 'my/module', module)

    expect(stator.$state.my.module.name).toBe('test')
    expect(stator.$getters.my.module.doublename).toBe('testtest')
    stator.$actions.my.module.setName('other')
    expect(stator.$state.my.module.name).toBe('other')

    store.unregisterModule(stator, 'my/module')

    // TODO: the my module is left behind even though it didnt exist initially
    expect(stator.$state.my.module).toBeUndefined()
    expect(stator.$getters.my.module).toBeUndefined()
    expect(stator.$actions.my.module).toBeUndefined()
  })

  test('does nothing when unregistering module with object', () => {
    const my = {
      state: {
        name: 'test'
      }
    }

    const config = {
      modules: { my }
    }

    const stator = store.createStore(config)

    stator.unregisterModule(my)

    expect(stator.$state.my).toBeDefined()
    expect(stator.$state.my.name).toBe('test')
  })

  test('throws error when dynamic module to register has no name', () => {
    const config = {}
    const module = {
      state: {
        name: 'test'
      }
    }

    const stator = store.createStore(config)
    expect(() => stator.registerModule(module)).toThrow()
  })

  test('can subscribe to actions using store method', async () => {
    const config = {
      state: {
        name: 'test'
      },
      actions: {
        setName (_, state, newName) {
          state.name = newName
        }
      }
    }

    const listener = jest.fn()

    const stator = store.createStore(config)

    stator.subscribe('name', listener)

    expect(stator.$state.name).toBe('test')
    stator.$actions.setName('other')
    expect(stator.$state.name).toBe('other')

    await Vue.nextTick()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('other', 'test')
  })

  test('can subscribe to actions using imports', async () => {
    const config = {
      modules: {
        my: {
          state: {
            firstName: 'first',
            lastName: 'last'
          },
          actions: {
            setFirstName (_, state, newName) {
              state.firstName = newName
            },
            setLastName (_, state, newName) {
              state.lastName = newName
            }
          }
        }
      }
    }

    const listener = jest.fn()

    const stator = store.createStore(config)

    watcher.subscribe(stator, 'my/firstName', listener)

    expect(stator.$state.my.firstName).toBe('first')
    stator.$actions.my.setFirstName('1st')
    stator.$actions.my.setLastName('2nd')
    expect(stator.$state.my.firstName).toBe('1st')

    await Vue.nextTick()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('1st', 'first')
  })

  test('combines module states', () => {
    const config = {
      state () {
        return {
          name: 'test'
        }
      },
      modules: {
        profile: {},
        user: {
          state: {
            userName: 'user'
          },
          modules: {
            profile: {
              state () {
                return {
                  profileName: 'profile'
                }
              }
            }
          }
        }
      }
    }

    const stator = store.createStore(config)

    expect(stator.$state).toEqual({
      name: 'test',
      user: {
        userName: 'user',
        profile: {
          profileName: 'profile'
        }
      }
    })
  })

  test('does not register non-function getters or actions', () => {
    const config = {
      state: {
        name: 'test'
      },
      getters: {
        doublename: true
      },
      actions: {
        setName: true
      }
    }

    const stator = store.createStore(config)

    expect(stator.$state.name).toBe('test')
    expect(stator.$getters.doublename).toBeUndefined()
    expect(stator.$actions.setName).toBeUndefined()
  })

  test('registers storage passed to config', () => {
    jest.spyOn(storage, 'registerStorage')

    const config = {
      state: {
        name: 'test'
      },
      storage: [1, 2]
    }

    store.createStore(config)

    expect(storage.registerStorage).toHaveBeenCalledTimes(1)
    expect(storage.registerStorage).toHaveBeenCalledWith(expect.any(Object), [1, 2])
  })
})
