import { IPatientEncounter, IPatientMedication, IPatientMedications } from 'schema';
import {
  IRedoxClinicalSummaryEncounter,
  IRedoxClinicalSummaryMedication,
  IRedoxClinicalSummaryQueryOptions,
} from '../types';
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

export function formatPatientMedications(
  medications: IRedoxClinicalSummaryMedication[],
): IPatientMedications {
  const emptyMeds = !medications.length;
  const noMedsMessage = medications.length && medications[0].Product.Name === 'None recorded.';

  if (emptyMeds || noMedsMessage) {
    return { medications: { active: [], inactive: [] } };
  } else {
    const now = new Date();
    const active: IPatientMedication[] = [];
    const inactive: IPatientMedication[] = [];

    medications.forEach((medication: IRedoxClinicalSummaryMedication) => {
      const { Period, Unit } = medication.Frequency;
      const route = medication.Route ? medication.Route.Name : 'Unknown route';
      const dosageInstructions = `Via ${route} every ${Period} ${Unit}`;
      const endDate = medication.EndDate;

      const formattedMedication = {
        name: medication.Product.Name,
        medicationId: medication.Product.Code,
        quantity: medication.Dose.Quantity,
        quantityUnit: medication.Dose.Units,
        startDate: medication.StartDate,
        dosageInstructions,
      };

      if (!endDate || new Date(endDate) > now) {
        active.push(formattedMedication);
      } else {
        inactive.push(formattedMedication);
      }
    });

    return { medications: { active, inactive } };
  }
}
