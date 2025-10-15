/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_HOST: string
  readonly VITE_DATABASE_PORT: string
  readonly VITE_DATABASE_NAME: string
  readonly VITE_DATABASE_USER: string
  readonly VITE_DATABASE_PASSWORD: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
