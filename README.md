### Usage
Basic
```
import magnet, { fromNode, fromM, fromLocal } from 'magnet-core'
const { env } = require('magnet-config/config').default

export const modules = [
  fromM(
    'config',
    !env.dev && { baseDirPath: `${process.cwd()}/dist` }
  ),
  fromM('bunyan'),
  fromM('folder-loader', { folders: [{ path: 'server/builds' }] }),
  fromLocal('fly')
]

magnet(modules)
.then(function (err) {
  process.exit()
})
.catch(function (err) {
  console.error(err)
  process.exit(1)
})
```

```
// server/builds/some.js
import * as fsExtra from 'fs-extra'
import * as _promise from 'bluebird'

const fs = _promise.promisifyAll(fsExtra)

export default function ({ config }) {
  config.fly.tasks = {
    *clean(fly) {
      yield fly.clear('dist');
    },

    *compileTypescripts(fly) {
      const tsconfigJson = await fs.readJsonAsync(`${process.cwd()}/tsconfig.json`)
      const compilerOptions = tsconfigJson.compilerOptions
      yield fly
        .source('server/**/*.js')
        .typescript(compilerOptions)
        .target('dist/server');
      yield fly
        .source('local_modules/**/*.js')
        .typescript(compilerOptions)
        .target('dist/local_modules');
    },

    *default(fly) {
      yield fly.serial(['clean', 'compileTypescripts'])
    },
  }
}
```
