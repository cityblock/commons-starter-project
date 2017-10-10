export default [
  {
    roles: ['familyMember'],
    allows: [],
  },
  {
    roles: ['healthCoach'],
    allows: [
      {
        resources: ['patient', 'user', 'clinic', 'task', 'patientAnswer', 'appointment'],
        permissions: ['edit', 'view', 'delete'],
      },
    ],
  },
  {
    roles: ['physician', 'nurseCareManager'],
    allows: [
      {
        resources: ['patient', 'clinic', 'task', 'patientAnswer', 'appointment'],
        permissions: ['edit', 'view', 'delete', 'create'],
      },
      {
        resources: ['user'],
        permissions: ['view', 'create', 'edit'],
      },
    ],
  },
  {
    roles: ['healthCoach', 'physician', 'nurseCareManager'],
    allows: [
      {
        resources: [
          'answer',
          'riskArea',
          'questionCondition',
          'question',
          'patientConcern',
          'patientGoal',
          'screeningTool',
          'patientScreeningToolSubmission',
        ],
        permissions: ['view'],
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
          'allUsers',
          'clinic',
          'task',
          'appointment',
          'answer',
          'patientAnswer',
          'riskArea',
          'questionCondition',
          'question',
          'concern',
          'patientConcern',
          'taskTemplate',
          'goalSuggestionTemplate',
          'patientGoal',
          'screeningTool',
          'patientScreeningToolSubmission',
        ],
        permissions: ['edit', 'view', 'delete', 'create'],
      },
    ],
  },
];
