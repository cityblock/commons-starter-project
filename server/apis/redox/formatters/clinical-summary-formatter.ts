import { IPatientEncounter } from 'schema';
import { IRedoxClinicalSummaryEncounter, IRedoxClinicalSummaryQueryOptions } from '../types';
import { formatRequestMeta } from './meta-formatter';

export function formatClinicalSummaryQueryOptions(
  patientId: string, healthSystemIdName: string,
): IRedoxClinicalSummaryQueryOptions {
  return {
    Meta: formatRequestMeta('Clinical Summary', 'PatientQuery'),
    Patient: {
      Identifiers: [
        {
          ID: patientId,
          IDType: healthSystemIdName,
        },
      ],
    },
  };
}

export function formatPatientEncounters(
  encounters: IRedoxClinicalSummaryEncounter[],
): IPatientEncounter[] {
  return encounters.map(encounter => {
    const encounterType = encounter.Type.Name;
    const providerName = encounter.Providers[0] ?
      `${encounter.Providers[0].FirstName} ${encounter.Providers[0].LastName}` : 'Unknown Provider';
    const providerRole = encounter.Providers[0] ?
      encounter.Providers[0].Role.Name : 'Unknown Provider Role';
    const location = encounter.Locations[0] ?
      encounter.Locations[0].Name || encounter.Locations[0].Address.StreetAddress :
      'Unknown Location';

    return {
      encounterType,
      providerName,
      providerRole,
      location,
      diagnoses: encounter.Diagnosis.map(diagnosis => ({
        code: diagnosis.Code,
        codeSystem: diagnosis.CodeSystemName,
        description: diagnosis.Name,
      })),
      reasons: encounter.ReasonForVisit.map(reason => (reason.Name)),
      dateTime: encounter.DateTime,
    };
  });
}
