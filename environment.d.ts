declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    DATABASE_URL: string;
    SESSION_SECRET: string;
    SPACES_KEY: string;
    SPACES_SECRET: string;
    SENDGRID_API_KEY: string;
  }
}
