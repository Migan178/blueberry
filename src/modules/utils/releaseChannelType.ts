export type ReleaseChannel = 'Canary' | 'Dev' | 'Preview' | 'Release'

export function returnReleaseChannel(channel: ReleaseChannel) {
  switch (channel) {
    case 'Canary':
      return '카나리아 채널'
    case 'Dev':
      return '개발 채널'
    case 'Preview':
      return '미리보기 채널'
    case 'Release':
      return '정식 채널'
  }
}
