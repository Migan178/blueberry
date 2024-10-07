export interface ChangeLog {
  version: string
  description: string
  modified: {
    newFeature?: string[]
    fixed?: string[]
    deleted?: string[]
    others?: string[]
  }
  updatedAt: string
}

// 현재는 테스트로 이렇게만 해뒀음.
export const changeLogs: ChangeLog[] = [
  {
    version: '0.0.0-hydrogen.241001a',
    description:
      '머핀봇 개발버전 4.0.0-Pudding(4.0.0-pudding.d241001b)을 기반으로 한 BlueBerry 코드명 Hydrogen 시작',
    modified: {
      newFeature: ['정보 명령어 추가', '슬래시 커맨드 지원 추가'],
      others: ['내부 구조 개선'],
    },
    updatedAt: new Date('2024-10-01').toLocaleDateString('ko', {
      dateStyle: 'full',
    }),
  },
  // ...
  {
    version: '1.0.0-blueberry.d240729a',
    description:
      '머핀봇 개발버전 3.0.0-Cake(3.0.0-cake.d240728b)를 기반으로 한 BlueBerry 개발 시작.',
    modified: {
      deleted: ['내수용 코드 삭제'],
    },
    updatedAt: new Date('2024-07-29').toLocaleTimeString('ko', {
      dateStyle: 'full',
    }),
  },
]
