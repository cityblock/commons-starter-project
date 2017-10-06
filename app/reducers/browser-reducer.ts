import { Action } from '../actions';

export type Size = 'small' | 'large';

interface IState {
  size: Size;
}

const initialState: IState = {
  size: (window as any).matchMedia('(max-width: 1024px)').matches ? 'small' : 'large',
};

export const browserReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'BROWSER_CHANGED':
      switch (action.mediaQueryMatch) {
        case true:
          return {
            ...initialState,
            size: 'small',
          };
        default:
          return {
            ...initialState,
            size: 'large',
          };
      }
    default:
      return state;
  }
};
