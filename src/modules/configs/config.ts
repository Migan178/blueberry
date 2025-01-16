import 'dotenv/config'

export class Config {
  public readonly bot = {
    token: process.env.BOT_TOKEN!,
    owner_ID: process.env.BOT_OWNER_ID!,
    check_preview_channel:
      process.env.BOT_CHECK_PREVIEW_CHANNEL === 'true' ? true : false,
  }

  public readonly api = {
    opendict: process.env.API_OPENDICT!,
  }

  public database_url = process.env.DATABASE_URL!
}
