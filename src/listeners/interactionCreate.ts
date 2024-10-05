import { container, Listener } from '@sapphire/framework'
import { ChatInputCommandInteraction } from 'discord.js'
import { previewWarning } from '../modules'

class InteractionCreateListener extends Listener {
  public async run(interaction: ChatInputCommandInteraction<'cached'>) {
    if (interaction.isChatInputCommand()) {
      const user = await this.container.database.user.findFirst({
        where: {
          user_id: interaction.user.id,
        },
      })
      if (user && user.release_channel !== this.container.channel) return
      if (this.container.channel !== 'RELEASE')
        await previewWarning(interaction)
    }
  }
}

void container.stores.loadPiece({
  piece: InteractionCreateListener,
  name: 'interactionCreate',
  store: 'listeners',
})
