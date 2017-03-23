import { Module } from 'magnet-core/module'
import * as Fly from 'fly'

export default class MagnetFly extends Module {
  get moduleName () { return 'fly' }
  get defaultConfig () { return __dirname }

  async setup () {
    this.insert(new Fly(this.config))

    await this.app.fly.start(this.config.start)
  }
}
