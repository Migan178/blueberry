import type { ChatInputCommandInteraction, Message } from 'discord.js'
import { Command, container } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { platform, arch } from 'os'

@ApplyOptions<Command.Options>({
  name: '정보',
  description: '머핀봇의 정보를 알ㄹ려줘요.',
  detailedDescription: {
    usage: '머핀아 정보',
  },
})
class InformationCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    await ctx.reply({
      embeds: [
        {
          title: `${this.container.client.user?.username}의 정ㅂ보`,
          color: this.container.embedColor,
          fields: [
            {
              name: '구동ㅎ환경',
              value: `\`${platform()} ${arch()}\``,
              inline: false,
            },
            {
              name: '버ㅈ전',
              value: `\`${this.container.version}\``,
              inline: true,
            },
            {
              name: '채ㄴ널',
              value: `\`${this.container.channel.toLowerCase()}\``,
              inline: true,
            },
            {
              name: '최근 업ㄷ데이트 날짜',
              value: `\`${this.container.lastUpdated.toLocaleDateString('ko', {
                dateStyle: 'long',
              })}\``,
              inline: true,
            },
            {
              name: '개ㅂ발자',
              value: `\`${
                (
                  await this.container.client.users.fetch(
                    this.container.config.bot.owner_ID,
                  )
                ).username
              }\``,
              inline: false,
            },
          ],
          thumbnail: {
            url: this.container.client.user!.displayAvatarURL()!,
          },
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
  piece: InformationCommand,
  name: 'information',
  store: 'commands',
})
