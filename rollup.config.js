import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
// import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import defaultsDeep from 'lodash.defaultsdeep'

const pkg = require('./package.json')

pkg.dependencies = pkg.dependencies || []
const superDependencies = ['vue']

const version = pkg.version

const banner = `/**
 * vue-stator v${version}
 * (c) ${new Date().getFullYear()}
 * - Jonas Galvez (@galvez)
 * - Pim (@pimlie)
 * - All the amazing contributors
 * @license MIT
 */
`

const babelConfig = () => ({
  presets: [
    ['@babel/preset-env', {
      /* useBuiltIns: 'usage',
      corejs: 2, */
      targets: {
        node: 8,
        ie: 9,
        safari: '5.1'
      }
    }]
  ]
})

function rollupConfig ({
  plugins = [],
  ...config
}) {
  // const isBrowserBuild = !config.output || !config.output.format || config.output.format === 'umd' || config.output.file.includes('.browser.')
  // const replaceConfig = {}

  return defaultsDeep({}, config, {
    input: 'index.js',
    output: {
      name: 'VueStator',
      format: 'umd',
      sourcemap: false,
      banner
    },
    external: superDependencies,
    plugins: [
      json(),
      nodeResolve(),
      // replace(replaceConfig),
      commonjs(),
      babel(babelConfig())
    ].concat(plugins)
  })
}

export default [
  // umd web build
  {
    output: {
      file: pkg.web
    }
  },
  // minimized umd web build
  {
    output: {
      file: pkg.web.replace('.js', '.min.js')
    },
    plugins: [
      terser()
    ]
  },
  // common js build
  {
    output: {
      file: pkg.main,
      format: 'cjs'
    },
    external: superDependencies.concat(Object.keys(pkg.dependencies))
  },
  // esm build
  {
    output: {
      file: pkg.web.replace('.js', '.esm.js'),
      format: 'es'
    },
    external: superDependencies.concat(Object.keys(pkg.dependencies))
  },
  // browser esm build
  {
    output: {
      file: pkg.web.replace('.js', '.esm.browser.js'),
      format: 'es'
    },
    external: superDependencies.concat(Object.keys(pkg.dependencies))
  },
  // minimized browser esm build
  {
    output: {
      file: pkg.web.replace('.js', '.esm.browser.min.js'),
      format: 'es'
    },
    plugins: [
      terser()
    ],
    external: superDependencies.concat(Object.keys(pkg.dependencies))
  }
].map(rollupConfig)
