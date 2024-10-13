import { Precondition } from '@sapphire/framework'
import { ChatInputCommandInteraction, Snowflake } from 'discord.js'

export default class OwnerOnlyPrecondition extends Precondition {
  private _message = '해당명령어는 개발자만 사용할 수 있어요.'
  private async _isOwner(userId: Snowflake) {
    return this.container.config.bot.owner_ID === userId
      ? this.ok()
      : this.error({
          message: this._message,
        })
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const isOwner = await this._isOwner(interaction.user.id)
    if (isOwner.isErr())
      await interaction.reply({
        ephemeral: true,
        content: this._message,
      })
    return isOwner
  }
}
