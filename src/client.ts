import { SapphireClient, container, LogLevel } from '@sapphire/framework'
import { Config, NODE_ENV, ReleaseChannel } from './modules'
import { GatewayIntentBits, Partials } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import { version } from '../package.json'
import semver from 'semver'

const config = new Config()

const release = version
  .slice((semver.coerce(version)?.toString() + '-').length)
  .split('.')[1]

container.config = config
container.prefix = config.bot.prefix
container.version = version
container.database = new PrismaClient()
container.dokdoAliases = ['dokdo', 'dok', 'Dokdo', 'Dok', '테스트']
container.lastUpdated = new Date('2024-10-13')
container.embedColors = {
  default: 0x0078d7,
  fail: 0xff0000,
  success: 0x00ff00,
}

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
    channel: ReleaseChannel
    lastUpdated: Date
    embedColors: {
      default: number
      fail: number
      success: number
    }
  }

  interface DetailedDescriptionCommandObject {
    usage: string
    examples?: string[]
  }

  interface Preconditions {
    IsJoined: never
    IsBlocked: never
    CheckChannel: never
    OwnerOnly: never
  }
}
