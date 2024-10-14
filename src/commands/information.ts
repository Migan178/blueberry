import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import type { ChatInputCommandInteraction, Message } from 'discord.js'
import { platform, arch } from 'os'

@ApplyOptions<Command.Options>({
  name: '정보',
  description: '블루베리의 정보를 알려줘요.',
  detailedDescription: {
    usage: '/정보',
  },
  preconditions: ['IsJoined', 'IsBlocked', 'CheckChannel'],
})
export default class InformationCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  private async _run(ctx: Message | ChatInputCommandInteraction) {
    await ctx.reply({
      embeds: [
        {
          title: `${this.container.client.user?.username}의 정보`,
          color: this.container.embedColors.default,
          fields: [
            {
              name: '구동환경',
              value: `\`${platform()} ${arch()}\``,
              inline: false,
            },
            {
              name: '버전',
              value: `\`${this.container.version}\``,
              inline: true,
            },
            {
              name: '채널',
              value: `\`${this.container.channel.toLowerCase()}\``,
              inline: true,
            },
            {
              name: '최근 업데이트 날짜',
              value: `\`${this.container.lastUpdated.toLocaleDateString('ko', {
                dateStyle: 'long',
              })}\``,
              inline: true,
            },
            {
              name: '개발자',
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
