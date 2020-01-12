import path from 'path'
import webpack from 'webpack'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

const srcDir = path.join(__dirname, '../..', 'src')

export function buildApp (config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)
        return
      }

      if (stats.hasErrors()) {
        const error = new Error('webpack compile errors')
        error.stats = stats
        reject(error)
        return
      }

      resolve(stats)
    })
  })
}

export function createConfig ({
  dir,
  entry
}) {
  return {
    // enable this below for debugging tests
    // devtool: 'inline-source-map',
    // mode: 'development',
    entry: path.join(dir, entry),
    output: {
      path: path.join(dir, 'dist'),
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  corejs: '2',
                  targets: { ie: 9, safari: '5.1' }
                }]
              ]
            }
          }
        },
        { test: /\.vue$/, use: 'vue-loader' }
      ]
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js',
        'vue-stator': process.env.NODE_ENV === 'development' ? srcDir : 'vue-stator'
      }
    },
    // Expose __dirname to allow automatically setting basename.
    context: __dirname,
    node: {
      __dirname: true
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ]
  }
}
