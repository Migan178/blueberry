import { type Message } from 'discord.js'

export async function noPerm(msg: Message) {
  await msg.reply({
    content: '당신은 내 제작자가 아니잖아!',
    allowedMentions: {
      repliedUser: false,
      parse: [],
      users: [],
      roles: [],
    },
  })
}
