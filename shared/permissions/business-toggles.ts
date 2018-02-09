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
  areAllMembersViewable: {
    name: 'areAllMembersViewable',
    isCareTeamCheckRequired: false,
  },
  areAllMembersEditable: {
    name: 'areAllMembersEditable',
    isCareTeamCheckRequired: false,
  },
  areMembersOnCareTeamViewable: {
    name: 'areMembersOnCareTeamViewable',
    isCareTeamCheckRequired: true,
  },
  areMembersOnCareTeamEditable: {
    name: 'areMembersOnCareTeamEditable',
    isCareTeamCheckRequired: true,
  },
  canDisenrollPatient: {
    name: 'canDisenrollPatient',
    isCareTeamCheckRequired: false,
  },
  isBreakGlassAlwaysEnabled: {
    name: 'isBreakGlassAlwaysEnabled',
    isCareTeamCheckRequired: false,
  },
};

export default businessToggles;
