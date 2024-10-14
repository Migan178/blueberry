import { returnReleaseChannel } from '../modules'
import { ApplyOptions } from '@sapphire/decorators'
import {
  InteractionHandlerTypes,
  InteractionHandler,
} from '@sapphire/framework'
import { StringSelectMenuInteraction } from 'discord.js'

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export default class PreviewChannelChangeInteractionHandler extends InteractionHandler {
  private _CUSTOM_ID = 'blueberry$previewChange'

  public async parse(interaction: StringSelectMenuInteraction) {
    if (!interaction.customId.startsWith(this._CUSTOM_ID)) return this.none()
    return this.some()
  }

  public async run(interaction: StringSelectMenuInteraction) {
    await interaction.deferUpdate()

    if (interaction.values[0].includes('cancel'))
      return interaction.editReply({
        embeds: [
          {
            title: `${this.container.client.user?.username}의 미리보기 채널변경`,
            description: '채널 변경을 취소했어요.',
            color: 0xff0000,
          },
        ],
        components: [],
      })

    const userId = interaction.values[0]
      .slice(`${this._CUSTOM_ID}-`.length)
      .match(/[0-9]/g)!
      .join('')
    const channel = interaction.values[0]
      .slice(`${this._CUSTOM_ID}-`.length)
      .replace(`@${userId}`, '')

    console.log(`${userId}`)

    await this.container.database.user.update({
      where: {
        user_id: userId,
      },
      data: {
        release_channel: channel.toUpperCase(),
      },
    })

    await interaction.editReply({
      embeds: [
        {
          title: `${this.container.client.user?.username}의 미리보기 채널변경`,
          description: `${returnReleaseChannel(channel.toUpperCase())}로 미리보기 채널변경을 했어요.`,
          color: 0x00ff00,
        },
      ],
      components: [],
    })
  }
}
