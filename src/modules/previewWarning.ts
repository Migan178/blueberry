import type { ChatInputCommandInteraction, Message } from 'discord.js'
import { container } from '@sapphire/framework'

export default async function previewWarning(
  ctx: Message<true> | ChatInputCommandInteraction<'cached'>,
) {
  await ctx.channel!.send({
    embeds: [
      {
        title: '정식 출시 이전 버전 사용안내',
        description:
          `현재 이 버전의 ${container.client.user?.username}은 정식출시 되기 이전이라 많이 불안정할 수 있어요.\n` +
          `만약 오류가 발견되면 ${(await container.client.users.fetch(container.config.bot.owner_ID)).username}님에게 알려주세요.\n`,
        color: 0xff0000,
        footer: {
          text: `현재 채널: ${container.channel.toLowerCase()} 버전: ${container.version}`,
        },
      },
    ],
  })
}
