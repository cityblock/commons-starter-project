import { format } from 'date-fns';
import HelloSign from 'hellosign-sdk';
import { get } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  DocumentTypeOptions,
  IHelloSignCreateInput,
  IHelloSignTransferInput,
  IRootMutationType,
} from 'schema';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import {
  formatAddress,
  formatAddressFirstLine,
  formatAddressSecondLine,
  formatCityblockId,
  formatPatientName,
  formatPhoneNumber,
} from '../helpers/format-helpers';
import { addJobToQueue } from '../helpers/queue-helpers';
import Patient from '../models/patient';
import PatientContact from '../models/patient-contact';
import PatientExternalOrganization from '../models/patient-external-organization';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

const hellosign = HelloSign({ key: config.HELLOSIGN_API_KEY });

const TEMPLATE_MAP = {
  treatmentConsent: config.HELLOSIGN_TEMPLATE_ID_CONSENT_TO_TREAT,
  phiSharingConsent: config.HELLOSIGN_TEMPLATE_ID_PHI_SHARING_CONSENT,
  hieHealthixConsent: config.HELLOSIGN_TEMPLATE_ID_HEALTHIX,
  hcp: config.HELLOSIGN_TEMPLATE_ID_HCP,
  molst: config.HELLOSIGN_TEMPLATE_ID_MOLST,
  textConsent: config.HELLOSIGN_TEMPLATE_ID_TEXT_CONSENT,
};

interface ISigners {
  email_address: string;
  name: string;
  role: string;
}

interface IHelloSignOptions {
  test_mode: number;
  clientId: string;
  subject: string;
  signers: ISigners[];
  template_id: string;
  custom_fields?: any;
}

export const getHelloSignOptions = async (
  patient: Patient,
  documentType: DocumentTypeOptions,
  txn: Transaction,
) => {
  const patientName = formatPatientName(patient.firstName, patient.lastName);
  const timestamp = format(new Date(), 'MM/DD/YY h:mm a');

  const options = {
    test_mode: config.HELLOSIGN_TEST_MODE ? 1 : 0,
    clientId: config.HELLOSIGN_CLIENT_ID,
    subject: `${patientName} - ${documentType} ${timestamp}`,
    signers: [
      {
        email_address: patient.patientInfo.primaryEmail
          ? patient.patientInfo.primaryEmail.emailAddress
          : 'test.account@cityblock.com',
        name: patientName,
        role: 'Member',
      },
    ],
    template_id: (TEMPLATE_MAP as any)[documentType],
  } as IHelloSignOptions;

  if (documentType === 'phiSharingConsent') {
    options.custom_fields = await getPHISharingConsentOptions(patient, txn);
  } else if (documentType === 'hieHealthixConsent') {
    options.custom_fields = await getHealthixOptions(patient, txn);
  } else if (documentType === 'hcp') {
    options.custom_fields = await getHCPOptions(patient, txn);
  } else if (documentType === 'treatmentConsent') {
    options.custom_fields = await getConsentToTreatOptions(patient, txn);
  } else if (documentType === 'molst') {
    options.custom_fields = await getMolstOptions(patient, txn);
  }

  return options;
};

interface IEntity {
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
}
const getPermissionText = (entity: IEntity) => {
  const isAllAuthorized =
    entity.isConsentedForFamilyPlanning &&
    entity.isConsentedForGeneticTesting &&
    entity.isConsentedForHiv &&
    entity.isConsentedForMentalHealth &&
    entity.isConsentedForStd &&
    entity.isConsentedForSubstanceUse;

  if (isAllAuthorized) {
    return 'ALL my health information';
  }
  const base = 'ALL my health information, except: ';
  const exceptions: string[] = [];
  if (!entity.isConsentedForFamilyPlanning) {
    exceptions.push('Family planning information');
  }
  if (!entity.isConsentedForHiv) {
    exceptions.push('HIV/AIDS');
  }
  if (!entity.isConsentedForStd) {
    exceptions.push('Sexually transmitted diseases');
  }
  if (!entity.isConsentedForGeneticTesting) {
    exceptions.push('Genetic testing');
  }
  if (!entity.isConsentedForSubstanceUse) {
    exceptions.push('Substance use disorder information');
  }
  if (!entity.isConsentedForMentalHealth) {
    exceptions.push('Mental health conditions');
  }

  return base + exceptions.join(', ');
};

export const getPHISharingConsentOptions = async (patient: Patient, txn: Transaction) => {
  const customFields = {
    patient_name: formatPatientName(patient.firstName, patient.lastName),
    home_address: formatAddress(patient.patientInfo.primaryAddress),
    home_phone_number: formatPhoneNumber(get(patient, 'patientInfo.primaryPhone.phoneNumber')),
    date_of_birth: format(patient.dateOfBirth, 'MM/DD/YY'),
  } as any;

  const organizations = await PatientExternalOrganization.getAllForConsents(patient.id, txn);

  organizations.forEach((organization, index) => {
    customFields[`organization_name_${index}`] = organization.name;
    customFields[`organization_permissions_${index}`] = getPermissionText(organization);
  });

  const individuals = await PatientContact.getAllForConsents(patient.id, txn);

  individuals.forEach((individual, index) => {
    customFields[`individual_name_${index}`] = formatPatientName(
      individual.firstName,
      individual.lastName,
    );
    customFields[`phone_number_${index}`] = formatPhoneNumber(get(individual, 'phone.phoneNumber'));
    customFields[`relationship_${index}`] =
      individual.relationFreeText || individual.relationToPatient;
    customFields[`individual_permissions_${index}`] = getPermissionText(individual);
  });

  return customFields;
};

export const getHCPOptions = async (patient: Patient, txn: Transaction) => {
  return {
    patient_name: formatPatientName(patient.firstName, patient.lastName),
    home_address: formatAddress(patient.patientInfo.primaryAddress),
  };
};

export const getHealthixOptions = async (patient: Patient, txn: Transaction) => {
  return {
    patient_name: formatPatientName(patient.firstName, patient.lastName),
    home_address: formatAddress(patient.patientInfo.primaryAddress),
    date_of_birth: format(patient.dateOfBirth, 'MM/DD/YY'),
    patient_id: formatCityblockId(patient.cityblockId),
  };
};

export const getConsentToTreatOptions = async (patient: Patient, txn: Transaction) => {
  return {
    patient_name: formatPatientName(patient.firstName, patient.lastName),
  };
};

export const getMolstOptions = async (patient: Patient, txn: Transaction) => {
  return {
    first_name: patient.firstName,
    last_name: patient.lastName,
    middle_initial: patient.middleName ? patient.middleName[0] : '',
    date_of_birth: format(patient.dateOfBirth, 'MM/DD/YY'),
    address_line_1: formatAddressFirstLine(patient.patientInfo.primaryAddress || {}),
    address_line_2: formatAddressSecondLine(patient.patientInfo.primaryAddress || {}),
  };
};

export interface IHelloSignCreateArgs {
  input: IHelloSignCreateInput;
}

export interface IHelloSignTransferArgs {
  input: IHelloSignTransferInput;
}

export async function helloSignCreate(
  root: {},
  { input }: IHelloSignCreateArgs,
  { userId, permissions, testTransaction, logger }: IContext,
): Promise<IRootMutationType['helloSignCreate']> {
  let url = '';
  let requestId = '';

  await transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    logger.log(`CREATE HelloSign upload URL for ${input.patientId} by ${userId}`);
    const patient = await Patient.get(input.patientId, txn);

    try {
      if (!testTransaction) {
        const options = await getHelloSignOptions(patient, input.documentType, txn);
        // start signature request
        const signatureRequest = await hellosign.signatureRequest.createEmbeddedWithTemplate(
          options,
        );
        const signatureId = signatureRequest.signature_request.signatures[0].signature_id;
        requestId = signatureRequest.signature_request.signature_request_id;

        // get url for iframe
        const signUrl = await hellosign.embedded.getSignUrl(signatureId);
        url = signUrl.embedded.sign_url;
      } else {
        url = 'www.winteriscoming.com';
        requestId = 'winIronThrone';
      }
    } catch (err) {
      reportError(
        err,
        `Error generating HelloSign URL for patient ${input.patientId} - ${input.documentType}`,
        input,
      );
    }
  });

  return { url, requestId };
}

export async function helloSignTransfer(
  root: {},
  { input }: IHelloSignTransferArgs,
  { userId, permissions, testTransaction, logger }: IContext,
) {
  await transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);
    logger.log(`TRANSFER HelloSign document for ${input.patientId} by ${userId}`);

    addJobToQueue(
      'processHelloSign',
      {
        userId,
        patientId: input.patientId,
        requestId: input.requestId,
        documentType: input.documentType,
      },
      { priority: 'high' },
    );
  });

  return true;
}
