import { SapphireClient, container, LogLevel } from '@sapphire/framework'
import { GatewayIntentBits, Partials } from 'discord.js'
import { ChatBot, Config, NODE_ENV } from './modules'
import { version } from '../package.json'
import { PrismaClient } from '../prisma'
import semver from 'semver'

const config = new Config()

// Load pieces
import './interaction-handlers/_load'
import './listeners/_load'
import './Commands/_load'

const release = version
  .slice((semver.coerce(version)?.toString() + '-').length)
  .split('.')[1]

container.config = config
container.prefix = config.bot.prefix
container.version = version
container.database = new PrismaClient()
container.dokdoAliases = ['dokdo', 'dok', 'Dokdo', 'Dok', '테스트']
container.chatBot = new ChatBot(container.database)
container.lastUpdated = new Date('2024-09-29')

if (release.startsWith('e')) {
  container.channel = 'EXPERIMENTAL'
} else if (release.startsWith('d')) {
  container.channel = 'DEV'
} else if (release.startsWith('p')) {
  container.channel = 'PREVIEW'
} else {
  container.channel = 'RELEASE'
}

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
      allowedMentions: {
        users: [],
        roles: [],
        repliedUser: true,
      },
      partials: [Partials.Message, Partials.ThreadMember],
      baseUserDirectory: null,
    })
  }

  public override async login(): Promise<string> {
    if (container.channel === 'RELEASE') await container.chatBot.train(this)
    else
      container.logger.info(
        '[MuffinBot] 해당 채널은 RELEASE 채널이 아니라서 학습 기능이 꺼졌습니다.\n' +
          `현재 채널: ${container.channel}`,
      )
    return super.login(config.bot.token)
  }
}

declare module '@sapphire/framework' {
  interface Container {
    database: PrismaClient
    chatBot: ChatBot
    prefix: string
    version: string
    dokdoAliases: string[]
    config: Config
    channel: 'EXPERIMENTAL' | 'DEV' | 'PREVIEW' | 'RELEASE'
    lastUpdated: Date
  }
}

declare module '@sapphire/framework' {
  interface DetailedDescriptionCommandObject {
    usage: string
    examples?: string[]
  }
}
