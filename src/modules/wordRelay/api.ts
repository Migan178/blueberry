import type { APIResponse } from './types'
import { container } from '@sapphire/framework'
import axios, { type AxiosResponse } from 'axios'

export class OpenDictAPI {
  private _url = 'https://opendict.korean.go.kr/api/search'
  private _key = container.config.api.opendict
  private _reqType = 'json'

  public async vaildWord(word: string): Promise<boolean> {
    const res = await axios.get<string, AxiosResponse<APIResponse>>(
      `${this._url}`,
      {
        params: {
          key: this._key,
          req_type: this._reqType,
          advanced: 'y',
          type1: 'word',
          type3: 'general',
          q: word,
        },
      },
    )

    return res.data.channel.total !== 0
  }

  public async getWords(lastWord: string) {
    const res = await axios.get<string, AxiosResponse<APIResponse>>(this._url, {
      params: {
        key: this._key,
        req_type: this._reqType,
        advanced: 'y',
        type1: 'word',
        type3: 'general',
        method: 'start',
        q: lastWord,
        letter_s: 2,
        num: 100,
        pos: 1,
      },
    })

    container.logger.debug(`opendict statusCode: ${res.status}`)
    return res
  }
}
