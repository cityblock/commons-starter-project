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
          'task',
          'patientAnswer',
          'appointment',
          'careTeam',
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
          'task',
          'patientAnswer',
          'appointment',
          'patientTaskSuggestion',
          'careTeam',
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
      {
        resources: [
          'carePlanSuggestion',
          'careTeam',
          'goalSuggestion',
          'patientTaskSuggestion',
          'taskSuggestion',
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
          'appointment',
          'answer',
          'patientAnswer',
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
        ],
        permissions: ['edit', 'view', 'delete', 'create'],
      },
    ],
  },
];
