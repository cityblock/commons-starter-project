import { ModelClass } from 'objection';
import Patient from '../../models/patient';

export type ResourceWithPatientIdMethod = 'patient';

type ResourceToModelMapping = { [K in ResourceWithPatientIdMethod]: ModelClass<any> };

const resourceToModelMapping: ResourceToModelMapping = {
  patient: Patient,
};

export default resourceToModelMapping;
