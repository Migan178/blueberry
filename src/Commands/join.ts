import { type Message, ComponentType, ButtonStyle } from 'discord.js'
import { Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Command.Options>({
  name: '가입',
  aliases: ['회원가입'],
  description: '블루베리의 회원가입입니다.',
})
class JoinCommmand extends Command {
  public async messageRun(msg: Message) {
    if (
      (await this.container.database.user.findOne(msg.author.id)).length !== 0
    )
      return await msg.reply(
        '당신은 이미 가입한 상태입니다.\n' +
          `만약 탈퇴를 원할 경우 ${this.container.prefix}탈퇴로 해주세요.\n`,
      )

    await msg.reply({
      embeds: [
        {
          title: `${this.container.client.user?.username} 서비스 가입`,
          description:
            '해당 서비스의 가입하면 당사의 이용약관(추후 제작 예정)과\n개인정보처리방침(추후 제작 예정)에 동의를 해야해요.',
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: '거절',
              style: ButtonStyle.Danger,
              customId: 'blueberry-join$decline',
            },
            {
              type: ComponentType.Button,
              label: '동의',
              style: ButtonStyle.Success,
              customId: `blueberry-join$accept@${msg.author.id}`,
            },
          ],
        },
      ],
    })
  }
}

container.stores.loadPiece({
  piece: JoinCommmand,
  name: 'join',
  store: 'commands',
})
