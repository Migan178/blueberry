import { Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import {
  ChatInputCommandInteraction,
  ComponentType,
  ButtonStyle,
  Message,
  User,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '가입',
  aliases: ['회원가입'],
  description: '블루베리의 회원가입입니다.',
  preconditions: ['IsBlocked', 'CheckChannel'],
})
class JoinCommmand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    let user: User
    let ephemeral: { ephemeral: boolean } | null
    if (ctx instanceof Message) {
      user = ctx.author
      ephemeral = null
    } else {
      user = ctx.user
      ephemeral = { ephemeral: true }
    }
    if (
      await this.container.database.user.findFirst({
        where: {
          user_id: user.id,
        },
      })
    )
      return await ctx.reply({
        ...ephemeral,
        content:
          '당신은 이미 가입한 상태입니다.\n' +
          `만약 탈퇴를 원할 경우 ${this.container.prefix}탈퇴로 해주세요.\n`,
      })

    await ctx.reply({
      ...ephemeral,
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
              customId: `blueberry-join$accept@${user.id}`,
            },
          ],
        },
      ],
    })
  }

  public async messageRun(msg: Message) {
    await this._run(msg)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}

void container.stores.loadPiece({
  piece: JoinCommmand,
  name: 'join',
  store: 'commands',
})
