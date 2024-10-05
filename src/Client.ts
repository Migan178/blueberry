import { SapphireClient, container, LogLevel } from '@sapphire/framework'
import { GatewayIntentBits, Partials } from 'discord.js'
import { Config, NODE_ENV } from './modules'
import { version } from '../package.json'
import { PrismaClient } from '../prisma'
import semver from 'semver'

const config = new Config()

// Load pieces
import './interaction-handlers/_load'
import './preconditions/_load'
import './listeners/_load'
import './Commands/_load'

const release = version
  .slice((semver.coerce(version)?.toString() + '-').length)
  .split('.')[1]

container.config = config
container.embedColor = 0xaddb87
container.prefix = config.bot.prefix
container.version = version
container.database = new PrismaClient()
container.dokdoAliases = ['dokdo', 'dok', 'Dokdo', 'Dok', '테스트']
container.lastUpdated = new Date('2024-10-05')

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
    return super.login(config.bot.token)
  }
}

declare module '@sapphire/framework' {
  interface Container {
    database: PrismaClient
    prefix: string
    version: string
    dokdoAliases: string[]
    config: Config
    channel: 'EXPERIMENTAL' | 'DEV' | 'PREVIEW' | 'RELEASE'
    lastUpdated: Date
    embedColor: number
  }

  interface DetailedDescriptionCommandObject {
    usage: string
    examples?: string[]
  }

  interface Preconditions {
    IsJoined: never
    IsBlocked: never
  }
}
