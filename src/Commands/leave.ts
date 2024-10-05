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
  name: '탈퇴',
  description: '블루베리 서비스에서 탈퇴해요.',
  detailedDescription: {
    usage: '베리야 탈퇴',
  },
  preconditions: ['IsJoined', 'IsBlocked', 'CheckChannel'],
})
class LeaveCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    let user: User
    let ephemeral: { ephemeral: boolean } | null
    const CUSTOM_ID = 'blueberry$leave'
    if (ctx instanceof Message) {
      user = ctx.author
      ephemeral = null
    } else {
      user = ctx.user
      ephemeral = { ephemeral: true }
    }

    await ctx.reply({
      ...ephemeral,
      embeds: [
        {
          title: '경고!',
          color: 0xff0000,
          description:
            '해당 작업은 사용자의 봇 내 재화와 사용자의 지식을 **모두 삭제합니다.**\n이를 원치 않으시면 취소 버튼을 눌러주세요.',
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: '취소',
              customId: `${CUSTOM_ID}-cancel`,
              style: ButtonStyle.Secondary,
            },
            {
              type: ComponentType.Button,
              label: '탈퇴',
              customId: `${CUSTOM_ID}-accept@${user.id}`,
              style: ButtonStyle.Danger,
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
  piece: LeaveCommand,
  name: 'leave',
  store: 'commands',
})
