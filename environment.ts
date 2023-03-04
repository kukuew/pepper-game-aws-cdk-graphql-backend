declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STARSHIPS_TABLE: string;
    }
  }
}

export {}