import { ApplyOptions } from '@sapphire/decorators'
import {
  InteractionHandlerTypes,
  InteractionHandler,
  container,
} from '@sapphire/framework'
import { ButtonInteraction } from 'discord.js'

@ApplyOptions<InteractionHandler.Options>({
  interactionHandlerType: InteractionHandlerTypes.Button,
})
class LeaveInteractionHandler extends InteractionHandler {
  private _CUSTOM_ID = 'blueberry$leave'
  public async parse(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith(this._CUSTOM_ID)) return this.none()
    return this.some()
  }

  public async run(interaction: ButtonInteraction) {
    await interaction.deferUpdate()
    const customId = interaction.customId.slice(`${this._CUSTOM_ID}-`.length)

    if (customId.startsWith('cancel')) {
      await interaction.update({
        embeds: [
          {
            title: '탈퇴',
            description: '탈퇴를 취소했어요.',
            color: 0xff0000,
          },
        ],
        components: [],
      })
    } else {
      const userId = customId.slice('accept@'.length)

      try {
        await this.container.database.user.delete({
          where: {
            user_id: userId,
          },
        })

        await interaction.editReply({
          embeds: [
            {
              title: '탈퇴',
              color: 0x00ff00,
              description: '탈퇴를 완료했어요.',
              timestamp: new Date().toISOString(),
              footer: {
                text: '탈퇴 일자',
              },
            },
          ],
          components: [],
        })
      } catch (err) {
        console.error(err)
        await interaction.reply({
          ephemeral: true,
          content:
            '오류가 생겨 탈퇴를 하지 못했어요. 다시 한번해보시고, 그래도 안되면 문의해주세요.',
        })
      }
    }
  }
}

void container.stores.loadPiece({
  piece: LeaveInteractionHandler,
  name: 'leave',
  store: 'interaction-handlers',
})
