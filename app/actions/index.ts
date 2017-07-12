import { IBrowserChanged } from './browser-action';
import { ILocaleSelected } from './locale-action';
import { ITaskSelected } from './task-action';

export type Action = ILocaleSelected | IBrowserChanged | ITaskSelected;
export type ActionType = Action['type'];
