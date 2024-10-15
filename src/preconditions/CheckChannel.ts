import { Precondition } from '@sapphire/framework'
import { ChatInputCommandInteraction, Message, Snowflake } from 'discord.js'

export default class CheckChannelPreicondition extends Precondition {
  public async messageRun(msg: Message) {
    return await this._checkChannel(msg.author.id)
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    return await this._checkChannel(interaction.user.id)
  }

  private async _checkChannel(userId: Snowflake) {
    if (!this.container.config.bot.check_preview_channel) return this.ok()
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: userId,
      },
    })

    if (!user) return this.ok()

    return user.release_channel === this.container.channel
      ? this.ok()
      : this.error()
  }
}
