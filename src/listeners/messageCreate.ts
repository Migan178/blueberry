import { noPerm } from '../modules'
import { Listener } from '@sapphire/framework'
import { type Message } from 'discord.js'
import { Client } from 'dokdo'

export default class MessageCreateListener extends Listener {
  public async run(msg: Message<true>) {
    const dokdo = new Client(this.container.client, {
      aliases: this.container.dokdoAliases,
      owners: [this.container.config.bot.owner_ID],
      prefix: `<@${this.container.client.user!.id}> `,
      secrets: [
        this.container.config.database_url,
        this.container.config.api.opendict,
      ],
      globalVariable: {
        container: this.container,
      },
      noPerm,
    })
    if (msg.author.bot) return
    await dokdo.run(msg)
  }
}
