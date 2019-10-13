import klaw from 'klaw'

export { default as getPort } from 'get-port'

export * from './constants'
export * from './nuxt'
export * from './browser'

export function listPaths (dir, pathsBefore = [], options = {}) {
  const items = []
  return new Promise((resolve) => {
    klaw(dir, options)
      .on('data', (item) => {
        const foundItem = pathsBefore.find(itemBefore => item.path === itemBefore.path)

        if (typeof foundItem === 'undefined' || item.stats.mtimeMs !== foundItem.stats.mtimeMs) {
          items.push(item)
        }
      })
      .on('end', () => resolve(items))
  })
}
