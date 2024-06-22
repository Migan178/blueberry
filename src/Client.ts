import { SapphireClient, container, LogLevel } from '@sapphire/framework'
import { GatewayIntentBits, type Snowflake } from 'discord.js'
import { ChatBot, NODE_ENV, MaaDatabase } from './modules'
import config from '../config.json'

container.config = config
container.prefix = '머핀아 '
container.database = new MaaDatabase()
container.chatBot = new ChatBot(container.database)

export default class MuffinBot extends SapphireClient {
  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      loadMessageCommandListeners: true,
      defaultPrefix: container.prefix,
      logger: {
        level: NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info,
      },
    })
  }

  public override async login(): Promise<string> {
    await container.chatBot.train(this)
    return super.login(config.bot.token)
  }
}

declare module '@sapphire/pieces' {
  interface Container {
    database: MaaDatabase
    chatBot: ChatBot
    prefix: string
    config: {
      bot: {
        owner_ID: Snowflake
        token: string
      }
      train: {
        user_ID: Snowflake
      }
      mysql: {
        user: string
        host: string
        password: string
        database: string
        port: number
      }
    }
  }
}
