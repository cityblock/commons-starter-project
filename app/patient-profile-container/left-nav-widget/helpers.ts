import { IconName } from '../../shared/library/icon/icon-types';
import { Selected } from './left-nav-widget';

type ActionIcons = { [K in Selected]: IconName };

export const ActionIconsMapping: ActionIcons = {
  careTeam: 'people',
  scratchPad: 'contentPaste',
  message: 'textSms',
  quickActions: 'apps',
};
