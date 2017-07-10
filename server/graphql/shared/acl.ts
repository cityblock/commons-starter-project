export default [
  {
    roles: [
      'familyMember',
    ],
    allows: [],
  },
  {
    roles: [
      'healthCoach',
    ],
    allows: [
      {
        resources: [
          'patient',
          'user',
          'clinic',
          'task',
          'appointment',
        ],
        permissions: [
          'edit',
          'view',
          'delete',
        ],
      },
    ],
  },
  {
    roles: [
      'physician',
      'nurseCareManager',
    ],
    allows: [
      {
        resources: [
          'patient',
          'user',
          'clinic',
          'task',
          'appointment',
        ],
        permissions: [
          'edit',
          'view',
          'delete',
          'create',
        ],
      },
    ],
  },
  {
    roles: [
      'admin',
    ],
    allows: [
      {
        resources: [
          'patient',
          'user',
          'allUsers',
          'clinic',
          'task',
          'appointment',
        ],
        permissions: [
          'edit',
          'view',
          'delete',
          'create',
        ],
      },
    ],
  },
];
