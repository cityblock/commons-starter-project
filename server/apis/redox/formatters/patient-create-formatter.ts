import { IPatientSetupInput } from 'schema';
import { IRedoxPatientCreateOptions, IRedoxPatientCreateResponse } from '../types';
import { formatRequestMeta } from './meta-formatter';

export function formatPatientCreateOptions(
  patient: IPatientSetupInput & { id: string },
): IRedoxPatientCreateOptions {
  return {
    Meta: formatRequestMeta('PatientAdmin', 'NewPatient'),
    Patient: {
      Identifiers: [
        {
          ID: patient.id,
          IDType: 'INTERNAL',
        },
      ],
      Demographics: {
        FirstName: patient.firstName,
        MiddleName: patient.middleName || undefined,
        LastName: patient.lastName,
        DOB: patient.dateOfBirth,
        SSN: patient.ssn || undefined,
        Sex: patient.gender || undefined,
        Race: patient.race || undefined,
        MaritalStatus: patient.maritalStatus || undefined,
        PhoneNumber: {
          Home: patient.homePhone || undefined,
          Mobile: patient.mobilePhone || undefined,
        },
        EmailAddresses: patient.email ? [patient.email] : undefined,
        Language: patient.language || undefined,
        Address: {
          StreetAddress: patient.address1 || undefined,
          City: patient.city || undefined,
          State: patient.state || undefined,
          ZIP: patient.zip,
          Country: patient.country || undefined,
        },
      },
      PCP: {
        Location: {
          Department: patient.homeClinicId,
        },
      },
      // Notes: [],
      Insurances: [
        {
          Plan: {
            ID: patient.insuranceType || undefined,
            IDType: 'Payer ID',
          },
          GroupNumber: patient.policyGroupNumber || undefined,
          EffectiveDate: patient.issueDate || undefined,
          ExpirationDate: patient.expirationDate || undefined,
          PolicyNumber: patient.memberId || undefined,
          Insured: {
            Relationship: patient.patientRelationshipToPolicyHolder || undefined,
          },
        },
      ],
    },
  };
}

export function getAthenaPatientIdFromCreate(response: IRedoxPatientCreateResponse): number | null {
  let athenaPatientId = null;
  response.Patient.Identifiers.forEach(identifier => {
    if (identifier.IDType === 'AthenaNet Enterprise ID') {
      athenaPatientId = Number(identifier.ID);
    }
  });
  return athenaPatientId;
}
