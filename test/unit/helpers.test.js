import Vue from 'vue'
import * as helpers from '~/helpers'
import * as namespace from '~/namespace'

jest.mock('vue')

describe('helpers', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  test('set', () => {
    helpers.$set(1)

    expect(Vue.set).toHaveBeenCalledTimes(1)
    expect(Vue.set).toHaveBeenCalledWith(1)
  })

  test('delete', () => {
    helpers.$delete(1)

    expect(Vue.delete).toHaveBeenCalledTimes(1)
    expect(Vue.delete).toHaveBeenCalledWith(1)
  })

  test('mapState', () => {
    jest.spyOn(namespace, 'getPropertyByNamespace').mockImplementation(_ => _)
    jest.spyOn(namespace, 'setPropertyByNamespace').mockImplementation(_ => _)

    const mapped = helpers.mapState(['name'])

    expect(mapped.name).toBeDefined()
    expect(mapped.name.get).toBeDefined()
    expect(mapped.name.set).toBeDefined()

    expect(namespace.getPropertyByNamespace).not.toHaveBeenCalled()
    expect(namespace.setPropertyByNamespace).not.toHaveBeenCalled()

    mapped.name.get()
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledTimes(1)
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledWith(undefined, 'name')

    mapped.name.set('value')
    expect(namespace.setPropertyByNamespace).toHaveBeenCalledTimes(1)
    expect(namespace.setPropertyByNamespace).toHaveBeenCalledWith(undefined, 'name', 'value')
  })

  test('mapGetters', () => {
    jest.spyOn(namespace, 'getPropertyByNamespace').mockImplementation(_ => _)

    const mapped = helpers.mapGetters(['name'])

    expect(mapped.name).toBeDefined()
    expect(mapped.name).toEqual(expect.any(Function))

    expect(namespace.getPropertyByNamespace).not.toHaveBeenCalled()

    mapped.name()
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledTimes(1)
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledWith(undefined, 'name')
  })

  test('mapActions', () => {
    const action = jest.fn()
    jest.spyOn(namespace, 'getPropertyByNamespace').mockImplementation(_ => action)

    const mapped = helpers.mapActions(['name'])

    expect(mapped.name).toBeDefined()
    expect(mapped.name).toEqual(expect.any(Function))

    expect(namespace.getPropertyByNamespace).not.toHaveBeenCalled()

    mapped.name()
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledTimes(1)
    expect(namespace.getPropertyByNamespace).toHaveBeenCalledWith(undefined, 'name')
    expect(action).toHaveBeenCalledTimes(1)
  })
})
