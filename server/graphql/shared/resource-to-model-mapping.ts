import { ModelClass } from 'objection';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Task from '../../models/task';

export type ResourceWithPatientIdMethod =
  | 'carePlanSuggestion'
  | 'patient'
  | 'patientAnswer'
  | 'task';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  carePlanSuggestion: CarePlanSuggestion,
  patient: Patient,
  patientAnswer: PatientAnswer,
  task: Task,
};

export default resourceToModelMapping;
