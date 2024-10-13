import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ChatInputCommandInteraction } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '차단',
  description: '(개발자 전용) 유저를 차단해요.',
  preconditions: ['OwnerOnly'],
})
export default class BlockCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('유저ID')
            .setDescription('유저의 ID를 입력해주세요.')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('사유')
            .setDescription('해당 유저가 차단된 사유를 입력해주세요.')
            .setRequired(true),
        ),
    )
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const userId = interaction.options.getString('유저ID', true)
    const reason = interaction.options.getString('사유', true)
    if (
      await this.container.database.user.findFirst({
        where: {
          user_id: userId,
        },
      })
    )
      return interaction.reply({
        ephemeral: true,
        content: '해당 유저를 찾지 못하였어요.',
      })

    try {
      await this.container.database.user.update({
        data: {
          blocked: true,
          block_reason: reason,
        },
        where: {
          user_id: userId,
        },
      })
      await interaction.reply({
        ephemeral: true,
        content: `해당 유저를 차단하였어요\n차단사유: ${reason}`,
      })
    } catch (err) {
      console.error(err)
      await interaction.reply({
        ephemeral: true,
        content: '헤당 유저를 차단하지 못하였어요.',
      })
    }
  }
}
