import * as storage from '~/storage'
import * as watcher from '~/watcher'

describe('storage', () => {
  beforeAll(() => {
    global.Storage = class Storage {}
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    delete global.Storage
  })

  test('validateStorage, Web Storage API is valid', () => {
    class LocalStorage extends Storage {}
    const localStorage = new LocalStorage()

    expect(storage.validateStorage(localStorage)).toBe(true)
  })

  test('validateStorage, getItem method is required', () => {
    const localStorage = { setItem () {} }

    expect(storage.validateStorage(localStorage)).toBe(false)
  })

  test('validateStorage, setItem method is required', () => {
    const localStorage = { getItem () {} }

    expect(storage.validateStorage(localStorage)).toBe(false)
  })

  test('validateStorage, item methods are required', () => {
    const localStorage = { setItem () {}, getItem () {} }

    expect(storage.validateStorage(localStorage)).toBe(true)
  })

  test('dumpState stringifies data', () => {
    const setItem = jest.fn()
    const data = 'test'

    storage.dumpState({ setItem }, 'namespace', data)

    expect(setItem).toHaveBeenCalledTimes(1)
    expect(setItem).toHaveBeenCalledWith('vue-stator:namespace', '"test"')
  })

  test('loadState parses data', () => {
    const getItem = jest.fn().mockReturnValue('"test"')
    const onSuccess = jest.fn()
    const onError = jest.fn()

    storage.loadState({ getItem }, 'namespace', onSuccess, onError)

    expect(getItem).toHaveBeenCalledTimes(1)
    expect(getItem).toHaveBeenCalledWith('vue-stator:namespace')
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(onSuccess).toHaveBeenCalledWith('test')
    expect(onError).not.toHaveBeenCalled()
  })

  test('loadState catches and logs parse error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(_ => _)

    const getItem = jest.fn().mockReturnValue('test')
    const onSuccess = jest.fn()
    const onError = jest.fn()

    storage.loadState({ getItem }, 'namespace', onSuccess, onError)

    expect(getItem).toHaveBeenCalledTimes(1)
    expect(getItem).toHaveBeenCalledWith('vue-stator:namespace')
    expect(onSuccess).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  test('registerStorage loads data from storage and subscribes for changes', () => {
    jest.spyOn(watcher, 'subscribe').mockImplementation(_ => _)

    const store = { $state: { name: 'test' } }
    const storageProvider = {
      setItem: jest.fn(),
      getItem: jest.fn()
    }

    storage.registerStorage(store, { storage: storageProvider, namespaces: ['name'] })

    expect(storageProvider.getItem).toHaveBeenCalledTimes(1)
    expect(storageProvider.getItem).toHaveBeenCalledWith('vue-stator:name')
    expect(watcher.subscribe).toHaveBeenCalledTimes(1)
    expect(watcher.subscribe).toHaveBeenCalledWith({
      $state: {
        name: 'test'
      }
    }, 'name', expect.any(Function))

    const subscribeCallback = watcher.subscribe.mock.calls[0][2]
    subscribeCallback('other')

    expect(storageProvider.setItem).toHaveBeenCalledTimes(1)
    expect(storageProvider.setItem).toHaveBeenCalledWith('vue-stator:name', '"other"')
  })

  test('registerStorage does not when storage provider not valid', () => {
    jest.spyOn(watcher, 'subscribe').mockImplementation(_ => _)

    const store = { $state: { name: 'test' } }
    const storageProvider = { getItem: jest.fn() }

    storage.registerStorage(store, [[storageProvider, ['name']]])

    expect(storageProvider.getItem).not.toHaveBeenCalled()
    expect(watcher.subscribe).not.toHaveBeenCalled()
  })
})
