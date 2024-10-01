import 'dotenv/config'

export default class MAAConfig {
  public readonly bot = {
    token: process.env.BOT_TOKEN!,
    owner_ID: process.env.BOT_OWNER_ID!,
    prefix: process.env.BOT_PREFIX!,
  }

  public readonly train = {
    user_ID: process.env.TRAIN_USER_ID!,
  }

  public readonly api = {
    opendict: process.env.API_OPENDICT!,
  }
}
