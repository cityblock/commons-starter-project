import { ModelClass } from 'objection';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Patient from '../../models/patient';
import Task from '../../models/task';

export type ResourceWithPatientIdMethod = 'carePlanSuggestion' | 'patient' | 'task';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  carePlanSuggestion: CarePlanSuggestion,
  patient: Patient,
  task: Task,
};

export default resourceToModelMapping;
