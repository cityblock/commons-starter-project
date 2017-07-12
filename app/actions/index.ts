import { IBrowserChanged } from './browser-action';
import { ILocaleSelected } from './locale-action';

export type Action = ILocaleSelected | IBrowserChanged;
export type ActionType = Action['type'];
