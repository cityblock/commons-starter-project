import { ModelClass } from 'objection';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Patient from '../../models/patient';

export type ResourceWithPatientIdMethod = 'carePlanSuggestion' | 'patient';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  carePlanSuggestion: CarePlanSuggestion,
  patient: Patient,
};

export default resourceToModelMapping;
