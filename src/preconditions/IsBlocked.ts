import { Precondition } from '@sapphire/framework'
import type {
  ChatInputCommandInteraction,
  Snowflake,
  Message,
} from 'discord.js'

export default class IsBlockedPrecondition extends Precondition {
  private _message = '당신은 해당 서비스에서 차단되었어요.\n차단 사유: {reason}'

  public async messageRun(msg: Message) {
    const isBlocked = await this._isBlocked(msg.author.id)
    if (isBlocked.isErr()) await msg.reply(this._message)
    return isBlocked
  }

  public async chatInputRun(interaction: ChatInputCommandInteraction) {
    const isBlocked = await this._isBlocked(interaction.user.id)
    if (isBlocked.isErr())
      await interaction.reply({
        ephemeral: true,
        content: this._message,
      })
    return isBlocked
  }

  private async _isBlocked(userId: Snowflake) {
    const user = await this.container.database.user.findFirst({
      where: {
        user_id: userId,
      },
    })

    if (!user) return this.ok()

    this._message = this._message.replace('{reason}', user.block_reason)
    return user.blocked
      ? this.error({
          message: this._message,
        })
      : this.ok()
  }
}
