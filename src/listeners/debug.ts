import { Listener } from '@sapphire/framework'

export default class DebugListener extends Listener {
  public async run(debug: string) {
    this.container.logger.debug(`[BlueBerry] ${debug}`)
  }
}
