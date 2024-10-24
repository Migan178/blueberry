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
    const userId = interaction.user.id
    /** @description If value is 1, lost the coin. Else, get the coin. */
    const isLost = Math.floor(Math.random() * 3)
    console.log(isLost)
    /** @description Multiple is 2 - 5. */
    const multiply = BigInt(Math.floor(Math.random() * 5) + 1)
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: userId,
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

    if (amount < 500)
      return await interaction.reply({
        ephemeral: true,
        content: '도박을 할려면 최소 500봇 내 재화가 필요해요.',
      })

    if (isLost !== 0) {
      await this.container.database.user.update({
        data: {
          money: user.money - amount,
        },
        where: {
          user_id: userId,
        },
      })
      return await interaction.reply({
        content: `도박에서 ${amount}봇 내 재화를 잃었어요.`,
      })
    }

    amount *= multiply

    await this.container.database.user.update({
      data: {
        money: user.money + amount,
      },
      where: {
        user_id: userId,
      },
    })
    await interaction.reply({
      content: `도박에서 ${multiply}배를 따 ${amount}원을 얻었어요.`,
    })
  }
}
