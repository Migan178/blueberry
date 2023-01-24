import { ActivityType, Client, GatewayIntentBits } from 'discord.js'
import ChatBot from './ChatBot.js'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

export default class MuffinAI extends Client {
  private chatBot = new ChatBot(
    join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'db.sqlite3')
  )
  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    })
  }

  public override login(): Promise<string> {
    this.chatBot.train(this)
    this.once('ready', client => {
      client.user!.setActivity({
        type: ActivityType.Playing,
        name: 'ㅅ살려주세요..!',
      })
      console.log(`먹힐 준비 완료`)
    }).on('messageCreate', msg => {
      if (msg.author.bot) return
      if (!msg.content.startsWith('머핀아 ')) return

      this.chatBot.getResponse(msg, true)
    })
    return super.login()
  }
}
