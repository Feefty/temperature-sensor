/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the temperature-sensor API. Defaults to the same-origin `/api/v1`. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
