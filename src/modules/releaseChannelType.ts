export type ReleaseChannel = 'EXPERIMENTAL' | 'DEV' | 'PREVIEW' | 'RELEASE'

export function returnReleaseChannel(channel: ReleaseChannel | string) {
  switch (channel) {
    case 'EXPERIMENTAL':
      return '실험 채널'
    case 'DEV':
      return '개발 채널'
    case 'PREVIEW':
      return '미리보기 채널'
    case 'RELEASE':
      return '정식 채널'
  }

  return '정식 채널'
}
