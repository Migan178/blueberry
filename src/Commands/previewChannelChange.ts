import { Command, container } from '@sapphire/framework'
import { ComponentType, type Message } from 'discord.js'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Command.Options>({
  name: '미리보기채널변경',
  description: '블루베리의 미리보기 채널을 변경해요.',
  aliases: ['미리보기', '채널변경', '미리보기변경'],
  detailedDescription: {
    usage: '베리야 미리보기채널변경',
  },
})
class PreviewChannelChangeCommand extends Command {
  public async messageRun(msg: Message) {
    const CUSTOM_ID = 'blueberry$previewChange'
    const EXPERIMENTAL = 'experimental'
    const DEV = 'dev'
    const PREVIEW = 'preview'
    const RELEASE = 'release'
    const description = '현재 채널을 {channel}로 설정해요.'
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: msg.author.id,
      },
    })

    // TODO: 유저가 없을 작동을 설정하기 (ex: 새로이 유저를 DB에 등록하는 등)
    if (!user) return

    await msg.reply({
      embeds: [
        {
          title: `${this.container.client.user?.username}의 미리보기 채널 변경`,
          description: `현재 ${msg.author.username}님이 속한 채널: ${user.release_channel.toLowerCase()}`,
          fields: [
            {
              name: `${EXPERIMENTAL} 채널`,
              value:
                '해당 채널은 다음 블루베리의 메이저 버전을 개발하거나, 실험적인 기능을 테스트하는 채널이에요. 따라서 매우 불안정할 수 있어요.',
              inline: false,
            },
            {
              name: `${DEV} 채널`,
              value:
                `해당 채널은 블루베리의 마이너 버전을 주로 테스트 하거나, ${EXPERIMENTAL} 채널에서 어느정도 안정이 된 버전을 받는 채널이에요.\n` +
                `해당 채널은 ${EXPERIMENTAL} 채널 보단 안정적이지만, 여전히 불안정할 수 있어요.`,
              inline: false,
            },
            {
              name: `${PREVIEW} 채널`,
              value: `해당 채널은 버그 픽스를 테스트하거나, ${DEV} 채널에서 개발된 기능들을 최종적으로 테스트 하는 채널이에요.`,
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
              customId: `${CUSTOM_ID}@${msg.author.id}`,
              options: [
                {
                  label: `${EXPERIMENTAL} 채널`,
                  description: description.replace('{channel}', EXPERIMENTAL),
                  value: `${CUSTOM_ID}-${EXPERIMENTAL}@${msg.author.id}`,
                },
                {
                  label: `${DEV} 채널`,
                  description: description.replace('{channel}', DEV),
                  value: `${CUSTOM_ID}-${DEV}@${msg.author.id}`,
                },
                {
                  label: `${PREVIEW} 채널`,
                  description: description.replace('{channel}', PREVIEW),
                  value: `${CUSTOM_ID}-${PREVIEW}@${msg.author.id}`,
                },
                {
                  label: `정식 채널`,
                  description: description.replace('{channel}', RELEASE),
                  value: `${CUSTOM_ID}-${RELEASE}@${msg.author.id}`,
                },
                {
                  label: '취소',
                  description: `채널을 ${user.release_channel.toLowerCase()}로 유지해요.`,
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

if (container.channel !== 'RELEASE')
  void container.stores.loadPiece({
    piece: PreviewChannelChangeCommand,
    name: 'previewChannelChange',
    store: 'commands',
  })
