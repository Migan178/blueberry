import { ApplyOptions } from '@sapphire/decorators'
import {
  type SelectMenuComponentOptionData,
  type User,
  ChatInputCommandInteraction,
  ComponentType,
  codeBlock,
  Message,
} from 'discord.js'
import {
  Args,
  Command,
  container,
  DetailedDescriptionCommandObject,
} from '@sapphire/framework'

@ApplyOptions<Command.Options>({
  name: '삭제',
  aliases: ['지워', '잊어'],
  description: '배운 단어를 삭제해요.',
  detailedDescription: {
    usage: '베리야 삭제 (삭제할 단어)',
    examples: ['베리야 삭제 베리'],
  },
  preconditions: ['IsJoined', 'IsBlocked'],
})
class DeleteLearnCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setRequired(true)
            .setName('단어')
            .setDescription('삭제할 단어를 입력해주세요.'),
        ),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction, args?: Args) {
    let command: string | null
    let user: User
    if (ctx instanceof Message) {
      command = await args!.rest('string').catch(() => null)
      user = ctx.author
    } else {
      command = ctx.options.getString('단어', true)
      user = ctx.user
    }

    const ephemeral =
      ctx instanceof ChatInputCommandInteraction ? { ephemeral: true } : null
    const CUSTOM_ID = 'blueberry$deleteLearn'
    const options: SelectMenuComponentOptionData[] = []
    const deleteDataList: string[] = []
    if (!command) {
      return await ctx.reply(
        `사용법: \n\`\`\`${(this.detailedDescription as DetailedDescriptionCommandObject).usage}\`\`\``,
      )
    }

    const deleteDatas = await this.container.database.learn.findMany({
      where: {
        command,
        user_id: user.id,
      },
    })

    if (deleteDatas.length === 0) {
      return await ctx.reply({
        ...ephemeral,
        content: '해당하는 걸 찾ㅈ을 수 없어요.',
      })
    }

    for (let i = 1; i <= deleteDatas.length; i++) {
      deleteDataList.push(`${i}. ${deleteDatas[i - 1].result}`)
      options.push({
        label: `${i}번 지식`,
        value: `${CUSTOM_ID}-${deleteDatas[i - 1].id}`,
        description: deleteDatas[i - 1].result.slice(0, 100),
      })
    }

    await ctx.reply({
      ...ephemeral,
      embeds: [
        {
          title: '삭제',
          description: `${codeBlock('md', deleteDataList.join('\n'))}`,
          timestamp: new Date().toISOString(),
          color: this.container.embedColor,
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.StringSelect,
              customId: `${CUSTOM_ID}@${user.id}`,
              placeholder: '지울 데이터를 선택해주세요',
              options: [
                ...options,
                {
                  label: '❌ 취소',
                  description: '아무것도 삭제하지 않아요.',
                  value: `${CUSTOM_ID}-cancel`,
                },
              ],
            },
          ],
        },
      ],
    })
  }

  public async messageRun(msg: Message, args: Args) {
    await this._run(msg, args)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}

void container.stores.loadPiece({
  piece: DeleteLearnCommand,
  name: 'delete',
  store: 'commands',
})
