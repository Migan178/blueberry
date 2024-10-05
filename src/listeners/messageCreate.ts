import { Listener, container } from '@sapphire/framework'
import { noPerm, previewWarning } from '../modules'
import { type Message } from 'discord.js'
import { Client } from 'dokdo'

class MessageCreateListener extends Listener {
  public async run(msg: Message<true>) {
    const prefix = this.container.prefix
    const dokdo = new Client(this.container.client, {
      aliases: this.container.dokdoAliases,
      owners: [this.container.config.bot.owner_ID],
      prefix: prefix,
      noPerm,
    })
    if (msg.author.bot) return
    if (msg.content.startsWith(prefix)) {
      const user = await this.container.database.user.findFirst({
        where: { user_id: msg.author.id },
      })
      if (user && user.release_channel !== this.container.channel) return
      if (this.container.channel !== 'RELEASE') await previewWarning(msg)

      await dokdo.run(msg)
    }
  }
}

void container.stores.loadPiece({
  piece: MessageCreateListener,
  name: 'messageCreate',
  store: 'listeners',
})
