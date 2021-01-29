import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import { BaseConnector, Reshuffle } from 'reshuffle-base-connector'

type Obj = Record<string, any>

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

export interface Transaction {
  titleName: string
  assetType: string
  assetId: string
  transactionDate: string
  transactionId: string
  originalTransactionId: string | null
  sourceType: string
  transactionType: string
  profile: string
}

function isBearerTokenExpired(token: string): boolean {
  const data = jwt.decode(token) as any
  if (!data || !data.exp) {
    return true
  }
  const exp = Number(data.exp)
  if (exp === 0 || isNaN(exp)) {
    return true
  }
  return 1000 * (exp - 10) < Date.now()
}

export class MoviesAnywhereConnector extends BaseConnector {
  private kcurl: string
  private maurl: string
  private clientId: string
  private clientSecret: string
  private bearerToken?: string

  constructor(app: Reshuffle, options: Obj = {}, id?: string) {
    super(app, options, id)

    if (options.staging) {
      this.kcurl = 'https://stage-api.keychest.io/keychest-extapi'
      this.maurl = 'https://stage-title-api.moviesanywhere.io/title'
    } else {
      this.kcurl = 'https://api.keychest.io/keychest-extapi'
      this.maurl = 'https://api.moviesanywhere.com/v1/title'
    }

    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
  }

  private async authenticate() {
    if (!this.clientId || !this.clientSecret) {
      return
    }

    if (this.bearerToken && !isBearerTokenExpired(this.bearerToken)) {
      return this.bearerToken
    }

    const client = `${this.clientId}:${this.clientSecret}`
    const basic = Buffer.from(client).toString('base64')

    const params = new URLSearchParams()
    params.append('client_id', this.clientId!)
    params.append('grant_type', 'client_credentials')

    const res = await fetch(`${this.kcurl}/oauth/token`, {
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
    if (data.token_type.toLowerCase() !== 'bearer') {
      throw new Error(`Movies Anywhere: Unsupported auth token type: ${
        data.token_type}`)
    }

    this.bearerToken = data.access_token
    return this.bearerToken
  }

  private async request(path: string, mustAuth = false): Promise<Obj> {
    const bearer = await this.authenticate()
    if (mustAuth && !bearer) {
      throw new Error('Not authorized')
    }
    const headers: Obj = bearer ? { Authorization: `Bearer ${bearer}` } : {}
    const res = await fetch(path, { headers })

    if (res.status !== 200) {
      throw new Error(`Movies Anywhere: API error: ${
        res.status} ${res.statusText}`)
    }

    return res.json()
  }

  private kcRequest(path: string) {
    return this.request(`${this.kcurl}${path}`, true)
  }

  private maRequest(path: string) {
    return this.request(`${this.maurl}${path}`)
  }

  // Actions ////////////////////////////////////////////////////////

  public async getAllTitles() {
    const res = await this.maRequest('')
    return { count: res.total, results: res.results }
  }

  public async getTitleById(id: string) {
    const res = await this.maRequest(`/${id}`)
    return res.results && res.results[0]
  }

  public async getTitleByEIDR(eidr: string) {
    const res = await this.maRequest(`?eidr=${eidr}`)
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
    const res = await this.maRequest(`/studio/${st}`)
    return { count: res.total, results: res.results }
  }

  public async getTransactionsByUser(userId: string) {
    const res = await this.kcRequest(`/v3/users/${userId}/transactions`)
    return res.transactions
  }
}
