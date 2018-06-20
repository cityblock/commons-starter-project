import { format } from 'date-fns';
import { FullSmsMessage } from '../../graphql/types';
import { Selected } from '../../reducers/patient-left-nav-reducer';
import { Color } from '../../shared/library/icon/icon';
import { IconName } from '../../shared/library/icon/icon-types';
import { QuickAction } from './left-nav-quick-action';

const DATE_FORMAT = 'MMM D, YYYY';

type ActionIcons = { [K in Selected]: IconName };
type QuickActionIcons = { [K in QuickAction]: IconName };
type QuickActionColors = { [K in QuickAction]: Color };

export const ActionIconsMapping: ActionIcons = {
  careTeam: 'people',
  scratchPad: 'contentPaste',
  message: 'textSms',
  quickActions: 'apps',
};

export const QuickActionIconsMapping: QuickActionIcons = {
  addProgressNote: 'noteAdd',
  addQuickCall: 'contactPhone',
  administerTool: 'assignment',
  viewDocuments: 'folderShared',
  openFormLibrary: 'folderOpen',
};

export const QuickActionColorsMapping: QuickActionColors = {
  addProgressNote: 'blue',
  addQuickCall: 'teal',
  administerTool: 'yellow',
  viewDocuments: 'green',
  openFormLibrary: 'purple',
};

export const isNewDate = (message1: FullSmsMessage, message2: FullSmsMessage): boolean => {
  return format(message1.createdAt, DATE_FORMAT) !== format(message2.createdAt, DATE_FORMAT);
};
