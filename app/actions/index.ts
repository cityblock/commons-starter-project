import { IAnswersReset, IAnswerAdd, IAnswerRemove } from './answer-action';
import { IBrowserChanged } from './browser-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { IIdleEnd, IIdleStart } from './idle-action';
import { ILocaleSelected } from './locale-action';
import { IPopupClose, IPopupOpen } from './popup-action';

export type Action =
  | ILocaleSelected
  | IBrowserChanged
  | IEventNotificationsCountUpdated
  | IIdleStart
  | IIdleEnd
  | IPopupOpen
  | IPopupClose
  | IAnswersReset
  | IAnswerAdd
  | IAnswerRemove;
export type ActionType = Action['type'];
