import { container, Precondition } from '@sapphire/framework'
import type { Message, Snowflake } from 'discord.js'

class IsBlockedPrecondition extends Precondition {
  private _message = '당신은 해당 서비스에서 차단되었어요.\n차단 사유: {reason}'

  public async messageRun(msg: Message) {
    const isBlocked = await this._isBlocked(msg.author.id)
    if (isBlocked.isErr()) {
      msg.reply(this._message)
    }
    return isBlocked
  }

  private async _isBlocked(userId: Snowflake) {
    const user = await this.container.database.user.findOne(userId)
    this._message = this._message.replace('{reason}', user[0].block_reason)
    return user[0].blocked
      ? this.error({
          message: this._message,
        })
      : this.ok()
  }
}

void container.stores.loadPiece({
  piece: IsBlockedPrecondition,
  name: 'IsBlocked',
  store: 'preconditions',
})
