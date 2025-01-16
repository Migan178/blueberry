type NODE_ENV_TYPE = 'production' | 'development' | string

export const NODE_ENV: NODE_ENV_TYPE = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : 'production'
