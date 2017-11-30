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
            ...state,
            size: 'small',
          };
        default:
          return {
            ...state,
            size: 'large',
          };
      }
    default:
      return state;
  }
};
