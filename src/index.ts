import fetch from 'node-fetch'
import { BaseConnector, Reshuffle } from 'reshuffle-base-connector'

type Options = Record<string, any>

export interface TitleCredit {
  name: string
  creditType: 'Cast' | 'Writers' | 'Directors' | 'Producers'
}

export interface TrailerAsset {
  id: string
  type: string
  url: string
  tags: string[]
}

export interface TitleTrailer {
  id: string
  title: string
  window: string
  assets: TrailerAsset[]
}

export interface Studio {
  name: string
}

export interface TitleData {
  title: string
  id: string
  eidr: string
  adamid: string
  profile: 'SD' | 'HD' | ' UHD'
  rating: string
  runtime: string
  genres: string[]
  slug: string
  releaseDate: string
  boxart: string
  heroImage: string
  hasPromoContent: boolean
  hasBonusContent: boolean
  description: string
  credits: TitleCredit[]
  trailers?: TitleTrailer[]
  studios: Studio[]
}

export interface TitleResponse {
  total: number
  results: TitleData[]
}

export class MoviesAnywhereConnector extends BaseConnector {
  private kcurl: string
  private maurl: string
  private clientId: string
  private clientSecret: string
  private auth?: Record<string, any> | null

  constructor(app: Reshuffle, options: Options = {}, id?: string) {
    super(app, options, id)

    if (options.staging) {
      this.kcurl = 'https://stage-api.keychest.io/keychest-extapi/oauth/token'
      this.maurl = 'https://stage-title-api.moviesanywhere.io/title'
    } else {
      this.kcurl = 'https://api.keychest.io/keychest-extapi/oauth/token'
      this.maurl = 'https://api.moviesanywhere.com/v1/title'
    }

    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.auth = this.clientId && this.clientSecret ? null : {}
  }

  private async authenticate() {
    if (this.auth === null) {
      const client = `${this.clientId}:${this.clientSecret}`
      const basic = Buffer.from(client).toString('base64')

      const params = new URLSearchParams()
      params.append('client_id', this.clientId!)
      params.append('grant_type', 'client_credentials')

      const res = await fetch(this.kcurl!, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })

      if (res.status !== 200) {
        throw new Error(`Movies Anywhere: Authorization failed: ${
          res.status} ${res.statusText}`)
      }

      const data = await res.json()
      if (data.token_type !== 'bearer') {
        throw new Error(`Movies Anywhere: Unsupported auth token type: ${
          data.token_type}`)
      }

      this.auth = { Authorization: `Bearer ${data.access_token}` }
    }

    return this.auth
  }

  private async request(req: string): Promise<TitleResponse> {
    const res = await fetch(
      `${this.maurl}${req}`,
      { headers: await this.authenticate() },
    )
    if (res.status !== 200) {
      throw new Error(`Movies Anywhere: API error: ${
        res.status} ${res.statusText}`)
    }
    return res.json()
  }

  // Actions ////////////////////////////////////////////////////////

  public async getAllTitles() {
    const res = await this.request('')
    return { count: res.total, results: res.results }
  }

  public async getTitleById(id: string) {
    const res = await this.request(`/${id}`)
    return res.results && res.results[0]
  }

  public async getTitleByEIDR(eidr: string) {
    const res = await this.request(`?eidr=${eidr}`)
    return res.results && res.results[0]
  }

  public async getTitlesByStudio(studio: string) {
    const st = ({
      disney: 'Disney',
      fox: 'Fox',
      lionsgate: 'Lionsgate',
      sony: 'Sony',
      universal: 'Universal',
      wb: 'WB',
    } as any)[studio.toLowerCase()]
    if (!st) {
      throw new Error(`Movies Anywhere: Unrecognized studio: ${studio}`)
    }
    const res = await this.request(`/studio/${st}`)
    return { count: res.total, results: res.results }
  }
}
