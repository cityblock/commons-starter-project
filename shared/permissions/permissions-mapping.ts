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

export type PermissionsMapping = {
  [K in BusinessToggleName]: boolean;
};

type PermissionsMappings = {
  [K in Permissions]: PermissionsMapping;
};

export const permissionsMappings: PermissionsMappings = {
  green: {
    isBuilderEnabled: true,
    isManagerEnabled: true,
    canChangeUserPermissions: true,
    canDeleteUsers: true,
    canBulkAssign: true,
    canEditCareTeam: true,
    canViewAllMembers: true,
    canEditAllMembers: true,
    canViewMembersOnPanel: true,
    canEditMembersOnPanel: true,
    canShowAllMembersInPatientPanel: true,
    canDisenrollPatient: true,
    canAutoBreakGlass: true,
  },
  pink: {
    isBuilderEnabled: true,
    isManagerEnabled: true,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    canViewAllMembers: true,
    canEditAllMembers: true,
    canViewMembersOnPanel: false,
    canEditMembersOnPanel: false,
    canShowAllMembersInPatientPanel: false,
    canDisenrollPatient: true,
    canAutoBreakGlass: false,
  },
  orange: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: true,
    canViewAllMembers: true,
    canEditAllMembers: true,
    canViewMembersOnPanel: true,
    canEditMembersOnPanel: true,
    canShowAllMembersInPatientPanel: true,
    canDisenrollPatient: true,
    canAutoBreakGlass: false,
  },
  blue: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: true,
    canViewAllMembers: true,
    canEditAllMembers: true,
    canViewMembersOnPanel: true,
    canEditMembersOnPanel: true,
    canShowAllMembersInPatientPanel: false,
    canDisenrollPatient: true,
    canAutoBreakGlass: false,
  },
  yellow: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    canViewAllMembers: true,
    canEditAllMembers: true,
    canViewMembersOnPanel: true,
    canEditMembersOnPanel: true,
    canShowAllMembersInPatientPanel: true,
    canDisenrollPatient: false,
    canAutoBreakGlass: false,
  },
  red: {
    isBuilderEnabled: false,
    isManagerEnabled: false,
    canChangeUserPermissions: false,
    canDeleteUsers: false,
    canBulkAssign: false,
    canEditCareTeam: false,
    canViewAllMembers: false,
    canEditAllMembers: false,
    canViewMembersOnPanel: true,
    canEditMembersOnPanel: false,
    canShowAllMembersInPatientPanel: false,
    canDisenrollPatient: false,
    canAutoBreakGlass: false,
  },
};
