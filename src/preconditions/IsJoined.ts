import { container, Precondition } from '@sapphire/framework'
import type { Message, Snowflake } from 'discord.js'

class IsJoinedPrecondition extends Precondition {
  private _message =
    '해당 기능을 사용할려면 가입을 해야해요. ' +
    `\`${this.container.prefix}가입\`으로 가입한 후 사용해주세요.`

  public async messageRun(msg: Message) {
    const isJoined = await this._isJoined(msg.author.id)
    if (isJoined.isErr()) {
      msg.reply(this._message)
    }
    return isJoined
  }

  // 명령어를 사용한 유저가 가입한 상태인지 판단하는 메소드
  private async _isJoined(userId: Snowflake) {
    const user = await this.container.database.user.findOne(userId)
    return user[0]
      ? this.ok()
      : this.error({
          message: this._message,
        })
  }
}

void container.stores.loadPiece({
  piece: IsJoinedPrecondition,
  name: 'IsJoined',
  store: 'preconditions',
})
