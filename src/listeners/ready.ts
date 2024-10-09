import { ApplyOptions } from '@sapphire/decorators'
import { ActivityType, Client } from 'discord.js'
import { Listener } from '@sapphire/framework'
import { listeners } from 'process'

@ApplyOptions<Listener.Options>({ once: true })
export default class ClientReadyListener extends Listener {
  public async run(client: Client<true>) {
    function setStatus(listener: Listener) {
      client.user.setActivity({
        type: ActivityType.Custom,
        name: `현재 개발중. (${listener.container.version})`,
      })
    }

    setStatus(this)
    setInterval(() => setStatus(this), 600000)

    this.container.logger.info(`[BlueBerry] Bot Ready.`)
  }
}
