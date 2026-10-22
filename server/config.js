import 'dotenv/config'

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  // Dev-only ID/password login. Must be off in production — see CLAUDE.md.
  enablePasswordLogin:
    (process.env.ENABLE_PASSWORD_LOGIN ?? 'true').toLowerCase() === 'true',

  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'sdcl_portal',
  },

  jwt: {
    secret: required('JWT_SECRET', process.env.NODE_ENV === 'production' ? undefined : 'dev-only-insecure-secret-change-me'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
    cookieName: 'sdcl_session',
  },

  // 32-byte key (64 hex chars) for AES-256-GCM, used to encrypt phone/bank fields.
  encryptionKeyHex: required(
    'ENCRYPTION_KEY',
    process.env.NODE_ENV === 'production' ? undefined : '0'.repeat(64),
  ),

  cookieSecure: (process.env.COOKIE_SECURE ?? 'false').toLowerCase() === 'true',
}
