import { returnReleaseChannel } from '../modules'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { type ChatInputCommandInteraction, ComponentType } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '미리보기채널변경',
  description: '블루베리의 미리보기 채널을 변경해요.',
  detailedDescription: {
    usage: '/미리보기채널변경',
  },
  preconditions: ['IsJoined', 'IsBlocked', 'CheckChannel'],
})
export default class PreviewChannelChangeCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const CUSTOM_ID = 'blueberry$previewChange'
    const EXPERIMENTAL = 'experimental'
    const DEV = 'dev'
    const PREVIEW = 'preview'
    const RELEASE = 'release'
    const description = '현재 채널을 {channel}로 설정해요.'
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: interaction.user.id,
      },
    })

    if (!user) return

    await interaction.reply({
      ephemeral: true,
      embeds: [
        {
          title: `${this.container.client.user?.username}의 미리보기 채널 변경`,
          description: `현재 ${interaction.user.username}님이 속한 채널: ${returnReleaseChannel(user.release_channel)}`,
          fields: [
            {
              name: `실험 채널`,
              value:
                '해당 채널은 다음 블루베리의 메이저 버전을 개발하거나, 실험적인 기능을 테스트하는 채널이에요. 따라서 매우 불안정할 수 있어요.',
              inline: false,
            },
            {
              name: `개발 채널`,
              value:
                `해당 채널은 블루베리의 마이너 버전을 주로 테스트 하거나, 실험 채널에서 어느정도 안정이 된 버전을 받는 채널이에요.\n` +
                `해당 채널은 실험 채널 보단 안정적이지만, 여전히 불안정할 수 있어요.`,
              inline: false,
            },
            {
              name: `미리보기 채널`,
              value: `해당 채널은 버그 픽스를 테스트하거나, 개발 채널에서 개발된 기능들을 최종적으로 테스트 하는 채널이에요.`,
              inline: false,
            },
            {
              name: `정식 채널`,
              value: '해당 채널은 정식 버전을 받는 채널이에요.',
              inline: false,
            },
          ],
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.StringSelect,
              customId: `${CUSTOM_ID}@${interaction.user.id}`,
              options: [
                {
                  label: `실험 채널`,
                  description: description.replace(
                    '{channel}',
                    returnReleaseChannel(EXPERIMENTAL.toUpperCase()),
                  ),
                  value: `${CUSTOM_ID}-${EXPERIMENTAL}@${interaction.user.id}`,
                },
                {
                  label: `개발 채널`,
                  description: description.replace(
                    '{channel}',
                    returnReleaseChannel(DEV.toUpperCase()),
                  ),
                  value: `${CUSTOM_ID}-${DEV}@${interaction.user.id}`,
                },
                {
                  label: `미리보기 채널`,
                  description: description.replace(
                    '{channel}',
                    returnReleaseChannel(PREVIEW.toUpperCase()),
                  ),
                  value: `${CUSTOM_ID}-${PREVIEW}@${interaction.user.id}`,
                },
                {
                  label: `정식 채널`,
                  description: description.replace(
                    '{channel}',
                    returnReleaseChannel(RELEASE.toUpperCase()),
                  ),
                  value: `${CUSTOM_ID}-${RELEASE}@${interaction.user.id}`,
                },
                {
                  label: '취소',
                  description: `채널을 ${returnReleaseChannel(user.release_channel)}로 유지해요.`,
                  value: `${CUSTOM_ID}-cancel`,
                },
              ],
            },
          ],
        },
      ],
    })
  }
}
