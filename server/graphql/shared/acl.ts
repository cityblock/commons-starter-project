import {
  builderResources,
  careTeamMemberResources,
  patientAllActionsAllowedResources,
  patientCreatableAndDeletableOnlyResoruces,
  patientCreatableOnlyResources,
  patientEditableOnlyResources,
  patientNotDeletableResources,
  patientViewOnlyResources,
  userResources,
} from './resource-group';

export default [
  {
    roles: ['isBuilderEnabled'],
    allows: [
      {
        resources: builderResources,
        permissions: ['create', 'view', 'edit', 'delete'],
      },
    ],
  },
  {
    roles: ['isManagerEnabled'],
    allows: [
      {
        resources: userResources,
        permissions: ['create', 'view'],
      },
    ],
  },
  {
    roles: ['canChangeUserPermissions'],
    allows: [{ resources: userResources, permissions: ['create', 'view', 'edit'] }],
  },
  {
    roles: ['canDeleteUsers'],
    allows: [{ resources: userResources, permissions: ['create', 'view', 'edit', 'delete'] }],
  },
  {
    roles: ['canBulkAssign'],
    allows: [
      { resources: ['careTeam', 'careTeamBulk'], permissions: ['create', 'view', 'delete'] },
      { resources: careTeamMemberResources, permissions: ['view'] },
    ],
  },
  {
    roles: ['canEditCareTeam'],
    allows: [
      { resources: ['careTeam'], permissions: ['create', 'view', 'delete'] },
      { resources: careTeamMemberResources, permissions: ['view'] },
    ],
  },
  {
    roles: ['canViewAllMembers', 'canViewMembersOnPanel'],
    allows: [
      { resources: patientViewOnlyResources, permissions: ['view'] },
      { resources: patientAllActionsAllowedResources, permissions: ['view'] },
      { resources: patientCreatableAndDeletableOnlyResoruces, permissions: ['view'] },
      { resources: patientCreatableOnlyResources, permissions: ['view'] },
      { resources: patientNotDeletableResources, permissions: ['view'] },
      { resources: patientEditableOnlyResources, permissions: ['view'] },
    ],
  },
  {
    roles: [
      'canViewAllMembers',
      'canEditAllMembers',
      'canViewMembersOnPanel',
      'canEditMembersOnPanel',
    ],
    allows: [{ resources: ['allPatients'], permissions: ['view'] }],
  },
  {
    roles: ['canEditAllMembers', 'canEditMembersOnPanel'],
    allows: [
      { resources: patientViewOnlyResources, permissions: ['view'] },
      {
        resources: patientAllActionsAllowedResources,
        permissions: ['create', 'view', 'edit', 'delete'],
      },
      {
        resources: patientCreatableAndDeletableOnlyResoruces,
        permissions: ['create', 'view', 'delete'],
      },
      { resources: patientCreatableOnlyResources, permissions: ['create', 'view'] },
      { resources: patientNotDeletableResources, permissions: ['create', 'view', 'edit'] },
      { resources: patientEditableOnlyResources, permissions: ['view', 'edit'] },
    ],
  },
  {
    roles: ['canShowAllMembersInPatientPanel'],
    allows: [{ resources: ['patient'], permissions: ['view'] }],
  },
  {
    roles: ['canDisenrollPatient'],
    allows: [{ resources: ['patient'], permissions: ['view', 'disenroll'] }],
  },
];
