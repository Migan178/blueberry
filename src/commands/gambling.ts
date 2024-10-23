import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import { ChatInputCommandInteraction } from 'discord.js'

@ApplyOptions<Command.Options>({
  name: '도박',
  description: '봇 내 재화로 도박을 해요.',
  detailedDescription: {
    usage: '/도박 금액:도박할 금액',
    examples: ['/도박 금액:1000', '/도박 금액:올인'],
  },
  preconditions: ['IsJoined', 'IsBlocked', 'CheckChannel'],
})
export default class GamblingCommand extends Command {
  public registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
          option
            .setName('금액')
            .setDescription('도박할 금액을 입력해주세요.')
            .setRequired(true),
        ),
    )
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const userInput = interaction.options.getString('금액', true)
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: interaction.user.id,
      },
    })
    let amount: bigint

    if (!user) return
    if (userInput === '올인' || userInput === '모두' || userInput === '전부') {
      amount = user.money
    } else {
      amount = BigInt(userInput)
    }

    if (amount > user.money)
      return await interaction.reply({
        ephemeral: true,
        content: '현재 봇 내 재화가 도박을 건 금액보다 적어요.',
      })

    // TODO: 확률적으로 도박을 건 돈에서 2 ~ 5배로 돌려주거나, 잃기

    if (amount < 500)
      return await interaction.reply({
        ephemeral: true,
        content: '도박을 할려면 최소 500봇 내 재화가 필요해요.',
      })
  }
}
