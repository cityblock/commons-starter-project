import { pickBy } from 'lodash';
import { BusinessToggleName } from './business-toggle-names';

interface IBusinessToggle {
  name: BusinessToggleName;
  isCareTeamCheckRequired: boolean;
}

type IBusinessToggles = {
  [K in BusinessToggleName]: IBusinessToggle;
};

const businessToggles: IBusinessToggles = {
  isBuilderEnabled: {
    name: 'isBuilderEnabled',
    isCareTeamCheckRequired: false,
  },
  isManagerEnabled:  {
    name: 'isManagerEnabled',
    isCareTeamCheckRequired: false,
  },
  canChangeUserPermissions: {
    name: 'canChangeUserPermissions',
    isCareTeamCheckRequired: false,
  },
  canDeleteUsers: {
    name: 'canDeleteUsers',
    isCareTeamCheckRequired: false,
  },
  canBulkAssign: {
    name: 'canBulkAssign',
    isCareTeamCheckRequired: false,
  },
  canEditCareTeam: {
    name: 'canEditCareTeam',
    isCareTeamCheckRequired: false,
  },
  canViewAllMembers: {
    name: 'canViewAllMembers',
    isCareTeamCheckRequired: false,
  },
  canEditAllMembers: {
    name: 'canEditAllMembers',
    isCareTeamCheckRequired: false,
  },
  canViewMembersOnPanel: {
    name: 'canViewMembersOnPanel',
    isCareTeamCheckRequired: true,
  },
  canEditMembersOnPanel: {
    name: 'canEditMembersOnPanel',
    isCareTeamCheckRequired: true,
  },
  canShowAllMembersInPatientPanel: {
    name: 'canShowAllMembersInPatientPanel',
    isCareTeamCheckRequired: false,
  },
  canDisenrollPatient: {
    name: 'canDisenrollPatient',
    isCareTeamCheckRequired: false,
  },
  canAutoBreakGlass: {
    name: 'canAutoBreakGlass',
    isCareTeamCheckRequired: false,
  },
};

export const businessTogglesWithCareTeamCheck = Object.keys(pickBy(businessToggles, toggle => toggle.isCareTeamCheckRequired)) as BusinessToggleName[];
export const businessTogglesWithoutCareTeamCheck = Object.keys(pickBy(businessToggles, toggle => !toggle.isCareTeamCheckRequired)) as BusinessToggleName[];

export default businessToggles;
