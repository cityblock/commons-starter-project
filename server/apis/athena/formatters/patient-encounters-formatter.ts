import { IPatientEncounter } from 'schema';
import { IPatientEncountersResponse } from '../types';

export function formatPatientEncounters(
  encountersResponse: IPatientEncountersResponse,
): IPatientEncounter[] {
  return encountersResponse.encounters.map(encounter => ({
    encounterType: encounter.encountertype,
    encounterId: encounter.encounterid,
    status: encounter.status,
    patientStatusId: encounter.patientstatusid,
    appointmentId: encounter.appointmentid,
    stage: encounter.stage,
    patientLocationId: encounter.patientlocationid,
    providerId: encounter.providerid,
    encounterDate: encounter.encounterdate,
    encounterVisitName: encounter.encountervisitname,
    patientLocation: encounter.patientlocation,
    diagnoses: encounter.diagnoses.map(diagnosis => ({
      diagnosisId: diagnosis.diagnosisid,
      icdCodes: diagnosis.icdcodes,
      snomedCode: diagnosis.snomedcode,
      description: diagnosis.description,
    })),
    patientStatus: encounter.patientstatus,
    providerPhone: encounter.providerphone,
    providerFirstName: encounter.providerfirstname,
    providerLastName: encounter.providerlastname,
    lastUpdated: encounter.lastupdated,
  }));
}
