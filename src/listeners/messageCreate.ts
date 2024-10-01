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
      if (this.container.channel !== 'RELEASE') await previewWarning(msg)

      const args = msg.content.slice(prefix.length).trim().split(/ +/g)

      this.container.logger.debug(`[ChatBot] command: ${args.join(' ')}`)

      if (dokdo.options.aliases?.includes(args[0])) {
        await dokdo.run(msg)
      } else {
        if (!this.container.stores.get('commands').get(args[0])) {
          await msg.channel.sendTyping()
          const response = await this.container.chatBot.getResponse(msg)
          response
            ? await msg.reply(response)
            : await msg.reply('해당하는걸 찾을 수 없어요.')
        }
      }
    }
  }
}

void container.stores.loadPiece({
  piece: MessageCreateListener,
  name: 'messageCreate',
  store: 'listeners',
})
