import { ModelClass } from 'objection';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
import PatientTaskSuggestion from '../../models/patient-task-suggestion';
import ProgressNote from '../../models/progress-note';
import QuickCall from '../../models/quick-call';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import Task from '../../models/task';

export type ResourceWithPatientIdMethod =
  | 'carePlanSuggestion'
  | 'patient'
  | 'patientAnswer'
  | 'patientConcern'
  | 'patientGoal'
  | 'patientScreeningToolSubmission'
  | 'patientTaskSuggestion'
  | 'progressNote'
  | 'quickCall'
  | 'riskAreaAssessmentSubmission'
  | 'task';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  carePlanSuggestion: CarePlanSuggestion,
  patient: Patient,
  patientAnswer: PatientAnswer,
  patientConcern: PatientConcern,
  patientGoal: PatientGoal,
  patientScreeningToolSubmission: PatientScreeningToolSubmission,
  patientTaskSuggestion: PatientTaskSuggestion,
  progressNote: ProgressNote,
  quickCall: QuickCall,
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission,
  task: Task,
};

export default resourceToModelMapping;
