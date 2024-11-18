import { WordRelay } from '../modules'
import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '끝말잇기',
  description: '베리랑 끝말잇기를 해보세요.',
  detailedDescription: {
    usage: '/끝말잇기',
  },
  preconditions: ['IsJoined', 'IsBlocked', 'CheckChannel'],
})
export default class WordRelayCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder.setName(this.name).setDescription(this.description),
    )
  }

  public async chatInputRun(
    interaction: ChatInputCommandInteraction<'cached'>,
  ) {
    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.CreatePublicThreads,
      )
    )
      return interaction.reply('제게 공개 스레드 만들기 권한이 없어요.')

    new WordRelay().startGame(interaction)
  }
}
