import path from 'path'
import fs from 'fs-extra'
import * as webpack from './webpack'
import { rimraf, loadFixture, Nuxt, Builder, BundleBuilder, Generator, listPaths } from '.'

export function buildVueFixture ({ dir, entry, urls, renderPage }) {
  const fixture = path.basename(dir)

  test(`Build ${fixture}`, async () => {
    const distDir = path.join(dir, 'dist')
    await rimraf(distDir)

    const config = webpack.createConfig({ dir, entry })
    await webpack.buildApp(config)

    await Promise.all(urls.map(async (url) => {
      const html = await renderPage({ url })

      const routePath = path.join(dir, 'dist', url)
      await fs.ensureDir(routePath)

      await fs.writeFile(path.join(routePath, 'index.html'), html)
    }))

    expect(await fs.exists(path.join(dir, 'dist', 'index.html'))).toBe(true)
    expect(await fs.exists(path.join(dir, 'dist', 'about/index.html'))).toBe(true)
  })
}

export function buildNuxtFixture ({ dir, generate, callback, hooks = [], changedPaths = [] }) {
  const pathsBefore = {}
  let nuxt

  const fixture = path.basename(dir)

  test(`Build ${fixture}`, async () => {
    const config = await loadFixture(dir, { _generate: true })
    nuxt = new Nuxt(config)

    pathsBefore.root = await listPaths(nuxt.options.rootDir)
    if (nuxt.options.rootDir !== nuxt.options.srcDir) {
      pathsBefore.src = await listPaths(nuxt.options.srcDir)
    }

    const buildDone = jest.fn()
    hooks.forEach(([hook, fn]) => nuxt.hook(hook, fn))
    nuxt.hook('build:done', buildDone)

    const builder = await new Builder(nuxt, BundleBuilder)

    if (generate) {
      const generator = new Generator(nuxt, builder)
      await generator.generate({ init: true, build: true })
    } else {
      await builder.build()
    }

    // 2: BUILD_DONE
    expect(builder._buildStatus).toBe(2)
    expect(buildDone).toHaveBeenCalledTimes(1)

    if (typeof callback === 'function') {
      callback(builder)
    }
  })

  test('Check changed files', async () => {
    expect.hasAssertions()

    const allowedPaths = [
      nuxt.options.buildDir,
      `${nuxt.options.srcDir}$`,
      `${nuxt.options.srcDir}/dist`,
      ...changedPaths.map(p => path.isAbsolute(p) ? p : path.join(nuxt.options.srcDir, p))
    ]

    const allowedPathsRE = new RegExp(`^(${allowedPaths.join('|')})`)

    // When building Nuxt we only expect files to changed
    // within the nuxt.options.buildDir
    for (const key in pathsBefore) {
      const paths = await listPaths(nuxt.options[`${key}Dir`], pathsBefore[key])

      for (const item of paths) {
        expect(item.path).toEqual(expect.stringMatching(allowedPathsRE))
      }
    }
  })
}
