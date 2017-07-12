export interface IBrowserChanged {
  type: 'BROWSER_CHANGED';
  mediaQueryMatch: boolean;
}

export function changeBrowser(mediaQueryMatch: boolean): IBrowserChanged {
  return {
    type: 'BROWSER_CHANGED',
    mediaQueryMatch,
  };
}
