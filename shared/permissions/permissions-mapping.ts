import { BusinessToggleName } from './business-toggle-names';

export type Permissions = 'green' | 'pink' | 'orange' | 'blue' | 'yellow' | 'red';
export const PERMISSIONS: Permissions[] = [
  'green',
  'pink',
  'orange',
  'blue',
  'yellow',
  'red',
];

type PermissionsMapping = {
  [K in BusinessToggleName]: boolean;
};

type PermissionsMappings = {
  [K in Permissions]: PermissionsMapping;
};

const PermissionsMappings: PermissionsMappings = {
  green: {
    isBuilderEnabled: true,
    isManagerEnabled: true,
    canChangeUserPermissions: true,
    canDeleteUsers: true,
    canBulkAssign: true,
    canEditCareTeam: true,
    areAllMembersViewable: true,
    areAllMembersEditable: true,
    areMembersOnCareTeamViewable: true,
    areMembersOnCareTeamEditable: true,
    canDisenrollPatient: true,
    isBreakGlassAlwaysEnabled: true,
  },
  pink: {
    isBuilderEnabled: true,
    isManagerEnabled: true,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    areAllMembersViewable: true,
    areAllMembersEditable: false,
    areMembersOnCareTeamViewable: false,
    areMembersOnCareTeamEditable: false,
    canDisenrollPatient: true,
    isBreakGlassAlwaysEnabled: false,
  },
  orange: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: true,
    areAllMembersViewable: true,
    areAllMembersEditable: true,
    areMembersOnCareTeamViewable: true,
    areMembersOnCareTeamEditable: true,
    canDisenrollPatient: true,
    isBreakGlassAlwaysEnabled: false,
  },
  blue: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: true,
    areAllMembersViewable: false,
    areAllMembersEditable: false,
    areMembersOnCareTeamViewable: true,
    areMembersOnCareTeamEditable: true,
    canDisenrollPatient: true,
    isBreakGlassAlwaysEnabled: false,
  },
  yellow: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    areAllMembersViewable: true,
    areAllMembersEditable: true,
    areMembersOnCareTeamViewable: false,
    areMembersOnCareTeamEditable: false,
    canDisenrollPatient: false,
    isBreakGlassAlwaysEnabled: false,
  },
  red: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    areAllMembersViewable: false,
    areAllMembersEditable: false,
    areMembersOnCareTeamViewable: false,
    areMembersOnCareTeamEditable: false,
    canDisenrollPatient: false,
    isBreakGlassAlwaysEnabled: false,
  },
};
