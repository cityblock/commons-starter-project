declare module 'langs' {
  export interface Language {
    name: string;
    loal: string;
    '1': string;
    '2': string;
    '2T': string;
    '2B': string;
    '3': string;
  }

  const all: () => Language[];
}
