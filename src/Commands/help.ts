import { Args, Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import {
  type ChatInputCommandInteraction,
  codeBlock,
  Message,
} from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '도움말',
  aliases: ['명령어', '도움', 'help'],
  description: '기본적인 사용법이에요.',
  detailedDescription: {
    usage: '베리야 도움말 [명령어]',
    examples: ['베리야 도움말', '베리야 도움말 배워'],
  },
})
class HelpCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    const commands = this.container.stores.get('commands').map(command => {
      return {
        name: command.name,
        value: command.name,
      }
    })
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('명령어')
            .setDescription('해당 명령어에 대ㅎ한 도움말을 볼 수 있어요.')
            .addChoices(commands),
        ),
    )
  }
  private async _run(ctx: Message | ChatInputCommandInteraction, args?: Args) {
    let commandName: string | null
    if (ctx instanceof Message) {
      commandName = await args!.pick('string').catch(() => null)
    } else {
      commandName = ctx.options.getString('명령어')
    }
    if (
      !commandName ||
      !this.container.stores.get('commands').get(commandName)
    ) {
      const commandList: string[] = []

      this.container.stores.get('commands').forEach(module => {
        commandList.push(`${module.name} - ${module.description}`)
      })

      await ctx.reply({
        embeds: [
          {
            title: `${this.container.client.user?.username}의 도움말`,
            description: codeBlock(
              'md',
              commandList.map(item => `-  ${item}`).join('\n'),
            ),
            footer: {
              text: `블루베리 버전: ${this.container.version}`,
            },
            color: this.container.embedColor,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    } else {
      const { name, aliases, description, detailedDescription } =
        this.container.stores.get('commands').get(commandName)!
      if (typeof detailedDescription === 'string') return

      await ctx.reply({
        embeds: [
          {
            title: `${this.container.client.user?.username}의 도움말`,
            description: `명령어: ${name}`,
            fields: [
              {
                name: '설명',
                value: description,
                inline: true,
              },
              {
                name: '별칭',
                value: aliases.map(item => `\`${item}\``).join(', '),
                inline: true,
              },
              {
                name: '사용법',
                value: `\`${detailedDescription.usage}\``,
                inline: true,
              },
              detailedDescription.examples
                ? {
                    name: '예시',
                    value: `\`\`\`${detailedDescription.examples.map(item => item).join('\n')}\`\`\``,
                    inline: false,
                  }
                : {
                    name: '예시',
                    value: '없음',
                    inline: false,
                  },
            ],
            footer: {
              text: `블루베리 버전: ${this.container.version}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      })
    }
  }
  public async messageRun(msg: Message, args: Args) {
    await this._run(msg, args)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    await this._run(interaction)
  }
}

void container.stores.loadPiece({
  piece: HelpCommand,
  name: 'help',
  store: 'commands',
})
