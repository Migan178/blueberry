import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ChatInputCommandInteraction } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '차단해제',
  description: '(개발자 전용) 사용자를 차단해제 해요.',
  detailedDescription: {
    usage: '/차단해제 유저id:유저의 ID',
    ownerOnly: true,
  },
  preconditions: ['OwnerOnly'],
})
export default class UnBlockCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('유저id')
            .setDescription('유저의 ID를 입력해주세요.')
            .setRequired(true),
        ),
    )
  }
  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const userId = interaction.options.getString('유저Id', true)
    if (
      !(await this.container.database.user.findFirst({
        where: {
          user_id: userId,
        },
      }))
    )
      return await interaction.reply({
        ephemeral: true,
        content: '해당 유저를 찾을 수 없어요.',
      })

    try {
      await this.container.database.user.update({
        data: {
          block_reason: '',
          blocked: false,
        },
        where: {
          user_id: userId,
        },
      })
      await interaction.reply({
        ephemeral: true,
        content: '해당 유저를 차단하였어요.',
      })
    } catch (err) {
      console.error(err)
      await interaction.reply({
        ephemeral: true,
        content: '해당 유저를 차단하지 못하였어요.',
      })
    }
  }
}
