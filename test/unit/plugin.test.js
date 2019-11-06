import plugin, * as injects from '~/plugin'
import * as store from '~/store'

describe('plugin', () => {
  test('does not install twice', () => {
    class VueTest {}
    VueTest.use = jest.fn()

    plugin.install(VueTest)
    expect(VueTest.use).toHaveBeenCalledTimes(1)
    plugin.install(VueTest)
    expect(VueTest.use).toHaveBeenCalledTimes(1)
  })
})

describe('inject', () => {
  afterEach(() => jest.restoreAllMocks())

  test('injectStator does its job', () => {
    jest.spyOn(store, 'createStore').mockReturnValue({
      $state: 1,
      $actions: 2,
      $getters: 3
    })

    class VueTest {}
    VueTest.use = jest.fn(fn => fn())

    injects.injectStator(VueTest, {})

    const component = new VueTest()
    component.$root = { $options: {} }

    expect(component.$stator).toBeDefined()
    expect(store.createStore).toHaveBeenCalled()

    expect(component.$state).toBe(1)
    expect(component.$actions).toBe(2)
    expect(component.$getters).toBe(3)
  })

  test('lazyInject does nothing if prop already defined', () => {
    jest.spyOn(Object, 'defineProperty')
    class VueTest {}
    VueTest.use = jest.fn(fn => fn())
    VueTest.prototype.$name = { key: false }

    injects.lazyInject(VueTest, 'name', () => {})

    expect(Object.defineProperty).not.toHaveBeenCalled()
  })

  test('lazyInject is lazy', () => {
    jest.spyOn(Object, 'defineProperty')

    class VueTest {}
    VueTest.use = jest.fn(fn => fn())

    const setter = jest.fn().mockReturnValue(true)

    injects.lazyInject(VueTest, 'name', setter)

    const component = new VueTest()
    component.$root = { $options: {} }

    expect(VueTest.use).toHaveBeenCalled()
    expect(Object.defineProperty).toHaveBeenCalled()
    expect(setter).not.toHaveBeenCalled()

    expect(component.$name).toBe(true)
    expect(setter).toHaveBeenCalledTimes(1)

    expect(component.$name).toBe(true)
    expect(setter).toHaveBeenCalledTimes(1)
  })

  test('lazyInject doesnt call setter when prop already set', () => {
    class VueTest {}
    VueTest.use = jest.fn(fn => fn())

    const setter = jest.fn().mockReturnValue(true)

    injects.lazyInject(VueTest, 'name', setter)

    const component = new VueTest()
    component.$root = {
      $options: { name: false }
    }

    expect(VueTest.use).toHaveBeenCalled()
    expect(setter).not.toHaveBeenCalled()

    expect(component.$name).toBe(false)
    expect(setter).not.toHaveBeenCalled()
  })

  test('inject returns component option', () => {
    class VueTest {}
    const component = new VueTest()
    component.$root = {
      $options: { key: true }
    }

    injects.inject(VueTest, 'name', 'key')

    expect(component.name).toBe(true)
  })

  test('injectProperty does nothing if prop already defined', () => {
    class VueTest {}
    VueTest.prototype.$name = { key: false }
    VueTest.prototype.key = true

    injects.injectProperty(VueTest, 'name', 'key')

    expect(new VueTest().key).toBe(true)
  })

  test('injectProperty returns as expected', () => {
    class VueTest {}
    VueTest.prototype.$name = { key: false }

    injects.injectProperty(VueTest, 'name', 'key')

    expect(new VueTest().key).toBe(false)
  })
})
