import { Resource } from './access-controls';

export const builderResources: Resource[] = [
  'riskAreaGroup',
  'riskArea',
  'question',
  'questionCondition',
  'answer',
  'concern',
  'concernSuggestion',
  'goalSuggestionTemplate',
  'goalSuggestion',
  'screeningTool',
  'taskTemplate',
  'taskSuggestion',
  'progressNoteTemplate',
  'computedField',
  'CBO',
  'CBOCategory',
  'patientList',
];

export const userResources: Resource[] = ['user', 'allUsers'];

export const careTeamMemberResources: Resource[] = ['user', 'patient'];

export const patientViewOnlyResources: Resource[] = [
  'clinic',
  'careTeam',
  'answer',
  'riskAreaGroup',
  'riskArea',
  'question',
  'questionCondition',
  'concern',
  'goalSuggestion',
  'goalSuggestionTemplate',
  'taskTemplate',
  'screeningTool',
  'progressNoteTemplate',
  'computedField',
  'patientList',
  'CBOCategory',
  'CBO',
];

export const patientAllActionsAllowedResources: Resource[] = [
  'task',
  'patientConcern',
  'carePlanSuggestion',
  'patientGoal',
  'patientTaskSuggestion',
  'progressNote',
  'CBOReferral',
];

export const patientCreatableAndDeletableOnlyResoruces: Resource[] = [
  'patientAnswer',
  'patientScreeningToolSubmission',
  'riskAreaAssessmentSubmission',
];

export const patientCreatableOnlyResources: Resource[] = ['computedFieldFlag', 'quickCall'];

export const patientNotDeletableResources: Resource[] = ['patient'];
