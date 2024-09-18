import { ApplyOptions } from '@sapphire/decorators'
import { type ButtonInteraction } from 'discord.js'
import {
  InteractionHandlerTypes,
  InteractionHandler,
  container,
} from '@sapphire/framework'

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Button,
})
class JoinHandler extends InteractionHandler {
  public async parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith('blueberry-join')) return this.none()
    return this.some()
  }

  public async run(interaction: ButtonInteraction) {
    const customId = interaction.customId.replace('blueberry-join$', '')

    if (customId.startsWith('decline')) {
      await interaction.update({
        embeds: [
          {
            title: `${this.container.client.user?.username} 서비스 가입`,
            color: 0xff0000,
            description: '서비스 가입을 거부하였어요.',
          },
        ],
        components: [],
      })
    } else {
      const userId = customId.replace('accept@', '')

      try {
        await this.container.database.user.create({
          data: {
            user_id: userId,
          },
        })
        await interaction.update({
          embeds: [
            {
              title: `${this.container.client.user?.username} 서비스 가입`,
              color: 0x00ff00,
              description: '서비스에 가입하였어요.',
            },
          ],
          components: [],
        })
      } catch (err) {
        console.log(err)
        await interaction.reply({
          ephemeral: true,
          content:
            '오류가 발생하여 가입을 할 수 없어요. 다시 해보시고, 그래도 안되면 개발자에게 문의해주세요.',
        })
      }
    }
  }
}

container.stores.loadPiece({
  piece: JoinHandler,
  name: 'join',
  store: 'interaction-handlers',
})
