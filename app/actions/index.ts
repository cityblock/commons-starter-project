import { CurrentUserAction, LogInUserAction } from './user';

export type Action = LogInUserAction | CurrentUserAction;

export type ActionType = Action['type'];
