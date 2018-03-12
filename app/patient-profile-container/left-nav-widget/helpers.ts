import { Color } from '../../shared/library/icon/icon';
import { IconName } from '../../shared/library/icon/icon-types';
import { QuickAction } from './left-nav-quick-action';
import { Selected } from './left-nav-widget';

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
