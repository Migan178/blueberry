import { ChatInputCommandInteraction, Message, codeBlock } from 'discord.js'
import { Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Command.Options>({
  name: '리스트',
  aliases: ['list', '목록'],
  description: '당신이 가르쳐준 단어를 나열해요.',
  detailedDescription: {
    usage: '베리야 리스트',
  },
  preconditions: ['IsJoined', 'IsBlocked'],
})
class ListCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    const user = ctx instanceof Message ? ctx.author : ctx.user
    const ephemeral =
      ctx instanceof ChatInputCommandInteraction ? { ephemeral: true } : null
    const db = this.container.database
    const data = await db.learn.findMany({
      where: {
        user_id: user.id,
      },
    })
    const list: string[] = []

    if (!data[0]) {
      return await ctx.reply({
        ...ephemeral,
        content: '당신은 단어를 가르쳐준 기억이 없는데요.',
      })
    }

    for (const listData of data) {
      list.push(listData.command)
    }

    await ctx.reply({
      embeds: [
        {
          title: `${user.username}님의 지식`,
          description: `총합: ${data.length}개\n${codeBlock(
            'md',
            list.map(item => `-  ${item}`).join('\n'),
          )}`,
          color: this.container.embedColor,
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  public async messageRun(msg: Message<boolean>) {
    await this._run(msg)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}

void container.stores.loadPiece({
  piece: ListCommand,
  name: 'list',
  store: 'commands',
})
