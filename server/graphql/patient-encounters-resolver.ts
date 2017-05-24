import { IPatientEncounterEdges, IPatientEncounterNode } from 'schema';
import { formatPatientEncounters } from '../apis/athena/formatters';
import { IPaginationOptions } from '../db';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

interface IResolvePatientEncountersOptions extends IPaginationOptions {
  patientId: string;
}

export async function resolvePatientEncounters(
  root: any,
  { patientId, pageNumber, pageSize }: IResolvePatientEncountersOptions,
  { userRole, athenaApi, userId }: IContext,
): Promise<IPatientEncounterEdges> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);
  const clinic = await Clinic.get(patient.homeClinicId);

  const limit = pageSize || 10;
  let offset: number = pageNumber || 0;

  if (offset !== 0) {
    offset = (pageNumber - 1) * limit;
  }

  const encountersResponse = await athenaApi.patientEncountersGet(
    patient.athenaPatientId, clinic.departmentId, limit, offset,
  );

  const encounters = formatPatientEncounters(encountersResponse);
  const encounterEdges = encounters.map((encounter, i) => (
    formatRelayEdge(encounter, encounter.encounterId.toString()) as IPatientEncounterNode
  ));

  return {
    edges: encounterEdges,
    pageInfo: {
      hasPreviousPage: !!encountersResponse.previous,
      hasNextPage: !!encountersResponse.next,
    },
  };
}
