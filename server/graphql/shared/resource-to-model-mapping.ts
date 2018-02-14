import { ModelClass } from 'objection';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';

export type ResourceWithPatientIdMethod =
  | 'carePlanSuggestion'
  | 'patient'
  | 'patientAnswer'
  | 'patientConcern'
  | 'patientGoal'
  | 'task';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  carePlanSuggestion: CarePlanSuggestion,
  patient: Patient,
  patientAnswer: PatientAnswer,
  patientConcern: PatientConcern,
  patientGoal: PatientGoal,
  task: Task,
};

export default resourceToModelMapping;
