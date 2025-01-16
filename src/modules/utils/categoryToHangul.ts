export type Category = 'accounts' | 'developers' | 'games' | 'others'

export function categoryToHangul(name: Category) {
  switch (name) {
    case 'accounts':
      return '계졍'
    case 'developers':
      return '개발자 전용'
    case 'games':
      return '게임'
    case 'others':
      return '기타'
  }
}
