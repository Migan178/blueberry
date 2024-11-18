// import { version } from '../package.json'
import { Config, NODE_ENV, ReleaseChannel } from './modules'
import { PrismaClient } from '@prisma/client'
import { SapphireClient, container, LogLevel } from '@sapphire/framework'
import { GatewayIntentBits, Partials } from 'discord.js'
import semver from 'semver'

const config = new Config()

const version = '0.0.0-hydrogen.241118a'

const release = version
  .slice((semver.coerce(version)?.toString() + '-').length)
  .split('.')[1]

function getLastUpdated() {
  const updated = release.match(/[0-9]/g)!.join('')
  const year = updated.slice(0, 2)
  const month = updated.slice(2, 4)
  const day = updated.slice(4, 6)
  return `20${year}-${month}-${day}`
}

container.config = config
container.prefix = '/'
container.version = version
container.database = new PrismaClient()
container.dokdoAliases = ['dokdo', 'dok', 'Dokdo', 'Dok', '테스트']
container.lastUpdated = new Date(getLastUpdated())
container.embedColors = {
  default: 0x0078d7,
  fail: 0xff0000,
  success: 0x00ff00,
}

if (release.startsWith('e')) {
  container.channel = 'Canary'
} else if (release.startsWith('d')) {
  container.channel = 'Dev'
} else if (release.startsWith('p')) {
  container.channel = 'Preview'
} else {
  container.channel = 'Release'
}

export default class MuffinBot extends SapphireClient {
  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
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
    ownerOnly?: boolean
  }

  interface Preconditions {
    IsJoined: never
    IsBlocked: never
    CheckChannel: never
    OwnerOnly: never
  }
}
