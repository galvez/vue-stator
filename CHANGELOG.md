# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/galvez/vue-stator/compare/v1.2.0...v1.3.0) (2020-01-16)


### Features

* add initial support for vue devtools ([#13](https://github.com/galvez/vue-stator/issues/13)) ([b47bcd3](https://github.com/galvez/vue-stator/commit/b47bcd3d7db8f6fe404dd8488d9b5190e6a3a80f))

## [1.2.0](https://github.com/galvez/vue-stator/compare/v1.2.0-beta.0...v1.2.0) (2019-11-22)


### Features

* expose / on store instance ([68c4334](https://github.com/galvez/vue-stator/commit/68c433414f53cbd19fccaba1e1265ad7b9df618e))


### Bug Fixes

* **nuxt:** add prefix to app. ([69a3d97](https://github.com/galvez/vue-stator/commit/69a3d9732d7588a576be55f3641b319e01761ee0))
* **nuxt:** allow to enable statorMap mixin as module option ([6f1d6c1](https://github.com/galvez/vue-stator/commit/6f1d6c10a182503133ecdd34b5e1437bc575f186))
* create module context outside for loop for actions ([91dc6e9](https://github.com/galvez/vue-stator/commit/91dc6e9b47bd66f77b1df17f0ac4c95bd301663e))

## [1.2.0-beta.0](https://github.com/galvez/vue-stator/compare/v1.1.1...v1.2.0-beta.0) (2019-11-19)


### Features

* add mixin for real ([f0b0b1b](https://github.com/galvez/vue-stator/commit/f0b0b1bae7153892fff209985cc7f7f152142923))
* add mixin to map state by component option ([f6d9809](https://github.com/galvez/vue-stator/commit/f6d98091e5bdc1689fafc39f8f93cf2021cc4e66))
* allow statorMap to be a function ([5e32620](https://github.com/galvez/vue-stator/commit/5e326203d5684485749c9757e973532656601484))


### Bug Fixes

* use similar fingerprints as Vuex for getters/actions ([3d6fd1e](https://github.com/galvez/vue-stator/commit/3d6fd1ec6c0db08ec5bfa96db2305313e0c403e7))

### [1.1.1](https://github.com/galvez/vue-stator/compare/v1.1.0...v1.1.1) (2019-11-15)


### Bug Fixes

* **nuxt:** in module its options ([569b848](https://github.com/galvez/vue-stator/commit/569b8480a837f16c9df9306554b6758417d42b35))
* **nuxt:** use stator dir ([2516fd6](https://github.com/galvez/vue-stator/commit/2516fd68fc996dc996658010a05a8c976b95704d))

## [1.1.0](https://github.com/galvez/vue-stator/compare/v1.0.0...v1.1.0) (2019-11-15)


### Features

* use nuxt vuex module for stator initialization ([b72b62e](https://github.com/galvez/vue-stator/commit/b72b62e583b883fcb87d4858615ecd0cfc267884))
* **nuxt:** add disableVuex option ([a307f8d](https://github.com/galvez/vue-stator/commit/a307f8dc3b0816cb76e0c1a579c2937afb526c67))
* support map aliases ([d066f6e](https://github.com/galvez/vue-stator/commit/d066f6ea88c9b60eec11eecfba1bbb9d54301d7a))


### Bug Fixes

* pass Nuxt ssrContext into store ([00bb63d](https://github.com/galvez/vue-stator/commit/00bb63d9078528c937ffcfe6990276e183f30a9a))

## [1.0.0](https://github.com/galvez/vue-stator/compare/v0.0.10...v1.0.0) (2019-11-15)


### Features

* **nuxt:** expose stator on context ([5afe201](https://github.com/galvez/vue-stator/commit/5afe201b48ce208a698c3368fc50f48823d87fc7))
* improve module support with namespacing ([#6](https://github.com/galvez/vue-stator/issues/6)) ([c0b23a2](https://github.com/galvez/vue-stator/commit/c0b23a2039965f76d224a482ad63b59ab8718b98))

### [0.0.10](https://github.com/galvez/vue-stator/compare/v0.0.9...v0.0.10) (2019-10-17)


### Features

* show warning in nuxt plugin when store folder doesnt exists ([51ccf6a](https://github.com/galvez/vue-stator/commit/51ccf6a5f48e44238384164522d83393c44e1f55))


### Bug Fixes

* explicitly use esm build in nuxt plugin ([be38538](https://github.com/galvez/vue-stator/commit/be385381e10403542f21ea7a377ec0e99a2c749c))
