import { ChatInputCommandInteraction, codeBlock, Message } from 'discord.js'
import { type Args, Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Command.Options>({
  name: '배워',
  aliases: ['공부'],
  description: '단어를 가르치는 명령어에요.',
  detailedDescription: {
    usage: '베리야 배워 (등록할 단어) (대답)',
    examples: [
      '베리야 배워 안녕 안녕!',
      '베리야 배워 "야 죽을래?" "아니요"',
      '베리야 배워 미간은_누구야? 이봇의_개발자요',
    ],
  },
})
class LearnCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setRequired(true)
            .setName('단어')
            .setDescription('등록할 단어를 입력해주세요.'),
        )
        .addStringOption(option =>
          option
            .setRequired(true)
            .setName('대답')
            .setDescription('해당 단어의 대답을 입력해주세요.'),
        ),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction, args?: Args) {
    if (ctx instanceof ChatInputCommandInteraction) ctx.deferReply()
    if (typeof this.detailedDescription === 'string') return

    const config = this.container.config
    const IG_MSG = '해당 단어는 배울 수 없어요.'
    const DI_MSG = '해당 단어는 개발자님이 특별히 금지하였어요.'
    const SUCCESS_MSG = '을/를 배웠ㅇ어요.'

    let command: string
    let result: string

    if (ctx instanceof Message) {
      command = (await args!.pick('string').catch(() => null))!.replaceAll(
        '_',
        ' ',
      )
      result = (await args!.pick('string').catch(() => null))!.replaceAll(
        '_',
        ' ',
      )

      if (!command || !result)
        return await ctx.reply(
          codeBlock(
            'md',
            `사용법: ${this.detailedDescription}
            예시: ${this.detailedDescription.examples?.map(example => example).join('\n')}`,
          ),
        )
    } else {
      command = ctx.options.getString('단어', true)
      result = ctx.options.getString('대답', true)
    }

    const commands: string[] = []
    const aliases: string[] = []

    this.container.stores.get('commands').forEach(module => {
      commands.push(module.name)
      module.aliases.forEach(alias => aliases.push(alias))
    })

    const ignore = [
      ...commands,
      ...aliases,
      ...this.container.dokdoAliases,
      '미간',
      'Migan',
      'migan',
      '간미',
    ]
    const disallowed = ['@everyone', '@here', `<@${config.bot.owner_ID}>`]
    const user = ctx instanceof Message ? ctx.author : ctx.user

    for (const ig of ignore) {
      if (command.includes(ig))
        return ctx instanceof Message
          ? await ctx.reply(IG_MSG)
          : await ctx.editReply(IG_MSG)
    }

    for (const di of disallowed) {
      if (result.includes(di))
        return ctx instanceof Message
          ? await ctx.reply(DI_MSG)
          : await ctx.editReply(DI_MSG)
    }

    await this.container.database.learn.create({
      data: {
        user_id: user.id,
        command,
        result,
      },
    })

    return ctx instanceof Message
      ? await ctx.reply(command + SUCCESS_MSG)
      : await ctx.editReply(command + SUCCESS_MSG)
  }

  public async messageRun(msg: Message, args: Args) {
    await this._run(msg, args)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}

void container.stores.loadPiece({
  piece: LearnCommand,
  name: 'learn',
  store: 'commands',
})
