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
    roles: ['familyMember'],
    allows: [],
  },
  {
    roles: ['healthCoach'],
    allows: [
      {
        resources: [
          'patient',
          'user',
          'clinic',
          'patientAnswer',
          'patientScreeningToolSubmission',
          'riskAreaAssessmentSubmission',
          'careTeam',
          'progressNote',
        ],
        permissions: ['edit', 'view', 'delete'],
      },
    ],
  },
  {
    roles: ['physician', 'nurseCareManager'],
    allows: [
      {
        resources: ['user'],
        permissions: ['view', 'create', 'edit'],
      },
      {
        resources: [
          'patient',
          'clinic',
          'patientAnswer',
          'patientScreeningToolSubmission',
          'riskAreaAssessmentSubmission',
          'patientTaskSuggestion',
          'careTeam',
          'progressNote',
          'quickCall',
        ],
        permissions: ['edit', 'view', 'delete', 'create'],
      },
    ],
  },
  {
    roles: ['healthCoach', 'physician', 'nurseCareManager'],
    allows: [
      {
        resources: [
          'answer',
          'concern',
          'goalSuggestionTemplate',
          'patientConcern',
          'patientGoal',
          'question',
          'questionCondition',
          'riskAreaGroup',
          'riskArea',
          'screeningTool',
          'patientList',
          'CBOCategory',
          'CBO',
        ],
        permissions: ['view'],
      },
      {
        resources: [
          'carePlanSuggestion',
          'careTeam',
          'goalSuggestion',
          'patientConcern',
          'patientTaskSuggestion',
          'patientAnswer',
          'patientScreeningToolSubmission',
          'riskAreaAssessmentSubmission',
          'taskSuggestion',
          'patientGoal',
          'progressNote',
          'quickCall',
          'task',
          'computedFieldFlag',
          'CBOReferral',
        ],
        permissions: ['view', 'create', 'edit', 'delete'],
      },
    ],
  },
  {
    roles: ['admin'],
    allows: [
      {
        resources: [
          'patient',
          'user',
          'careTeam',
          'allUsers',
          'clinic',
          'task',
          'answer',
          'patientAnswer',
          'riskAreaGroup',
          'riskArea',
          'questionCondition',
          'question',
          'concern',
          'patientConcern',
          'carePlanSuggestion',
          'goalSuggestion',
          'goalSuggestionTemplate',
          'patientGoal',
          'taskTemplate',
          'taskSuggestion',
          'patientTaskSuggestion',
          'screeningTool',
          'patientScreeningToolSubmission',
          'riskAreaAssessmentSubmission',
          'progressNote',
          'progressNoteTemplate',
          'quickCall',
          'computedField',
          'computedFieldFlag',
          'patientList',
          'CBOCategory',
          'CBO',
          'CBOReferral',
        ],
        permissions: ['edit', 'view', 'delete', 'create'],
      },
    ],
  },
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
