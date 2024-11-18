import { OpenDictAPI } from './api'
import type { APIResponse, Item } from './types'
import { AxiosResponse } from 'axios'
import {
  type ChatInputCommandInteraction,
  type Message,
  type APIEmbed,
  ChannelType,
} from 'discord.js'

export class WordRelay {
  private _usedWords: string[] = []
  private _api = new OpenDictAPI()
  private _isStarted = false

  public async validWord(word: string): Promise<boolean> {
    return await this._api.vaildWord(word)
  }

  public async startGame(interaction: ChatInputCommandInteraction<'cached'>) {
    const TIMEOUT_PRE_START = 'timeout: pre start'
    const userID = interaction.user.id
    const USER_WIN = 'userWin'
    const BOT_WIN = 'botWin'
    const embed: APIEmbed = {
      title: `${interaction.user.username}의 끝말잇기`,
      footer: {
        text: interaction.user.username,
        icon_url: interaction.user.displayAvatarURL(),
      },
    }

    try {
      const channel = interaction.channel
      if (channel?.type !== ChannelType.GuildText) return
      const thread = await channel.threads.create({
        name: `${interaction.user.username}-끝말잇기`,
      })

      const embedMsg = await thread.send({
        content: `<@${userID}>님, 여기 들어와서 시작단어를 60초안에 입력해주세요!`,
        embeds: [embed],
      })

      const collector = thread.createMessageCollector({
        filter: (message: Message) => message.author.id === userID,
      })

      // 60초동안 사용자 입력이 없을 시 자동으로 게임종료
      setTimeout(() => {
        if (!this._isStarted) return collector.stop(TIMEOUT_PRE_START)
        else return
      }, 60_000)

      collector.on('collect', async message => {
        const content = message.content
        if (content.length < 2)
          return await message.reply(
            '해당 단어는 너무 짧아요. 다시 한번 입력해주세요.',
          )

        if (this._usedWords.includes(content))
          return await message.reply('이미 한번쓴 단어는 못써요!')

        const isValid = await this.validWord(content)

        if (!this._isStarted && !isValid)
          return await message.reply(
            '해당 단어는 일치하지 않아요. 다시 한번 입력해주세요.',
          )
        else if (this._isStarted && !isValid) return collector.stop(BOT_WIN)

        const lastChar = content.charAt(content.length - 1)
        const nextWordInfo = await this.getWord(lastChar)

        if (!this._isStarted) {
          if (!nextWordInfo)
            return await message.reply(
              '시작단어가 한방단어면 안돼요. 다시 한번 입력해주세요.',
            )

          this._isStarted = true
        } else {
          const lastWord = this._usedWords[this._usedWords.length - 1]
          const lastChar = lastWord.charAt(lastWord.length - 1)
          if (!content.startsWith(lastChar))
            return await message.reply(
              '시작단어가 마지막으로 쓴 단어의 마지막 글자여야 해요.',
            )
        }

        if (!nextWordInfo) return collector.stop(USER_WIN)

        const nextWord = nextWordInfo.word.replaceAll('-', '')

        this._usedWords.push(content) // 유저가 친 단어
        this._usedWords.push(nextWord) // 봇이 친 단어

        await embedMsg.edit({
          embeds: [
            {
              ...embed,
              description: this._usedWords
                .map(word => `\`${word}\``)
                .join(' -> '),
            },
          ],
        })

        await message.reply(
          `${nextWord}\n\`${nextWordInfo.sense[0].definition}\`\n다음 단어를 입력해주세요!`,
        )
      })

      collector.on('end', (_, reason) => {
        if (reason === USER_WIN)
          void thread.send('더이상 다음단어가 생각이 안나요. 당신이 이겼어요!')
        else if (reason === BOT_WIN)
          void thread.send('단어가 일치하지 않아 제가 이겼어요!')
        else if (reason === TIMEOUT_PRE_START)
          void thread.send(
            `<@${userID}>님, 60초동안 시작단어를 입력하지 않아 자동으로 게임이 종료되었어요.`,
          )
      })
    } catch (err) {
      console.error(err)
    }
  }

  private _getRandomWord(res: AxiosResponse<APIResponse>): Item | null {
    if (!res.data) return null
    if (!res.data.channel.total) return null

    const items = res.data.channel.item
    const wordInfo = items[Math.floor(Math.random() * items.length)]

    if (this._usedWords.includes(wordInfo.word) || wordInfo.word.length < 2)
      return this._getRandomWord(res)

    return wordInfo
  }

  public async getWord(lastWord: string) {
    return this._getRandomWord(await this._api.getWords(lastWord))
  }
}
