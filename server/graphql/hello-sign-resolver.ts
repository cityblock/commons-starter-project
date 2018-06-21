import { format } from 'date-fns';
import { transaction } from 'objection';
import {
  DocumentTypeOptions,
  IHelloSignCreateInput,
  IHelloSignTransferInput,
  IRootMutationType,
} from 'schema';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { formatPatientName } from '../helpers/format-helpers';
import { addJobToQueue } from '../helpers/queue-helpers';
import Patient from '../models/patient';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

/* tslint:disable no-var-requires */
const hellosign = require('hellosign-sdk')({ key: config.HELLOSIGN_API_KEY });
/* tslint:enable */

export const getHelloSignOptions = (patient: Patient, documentType: DocumentTypeOptions) => {
  const patientName = formatPatientName(patient.firstName, patient.lastName);
  const timestamp = format(new Date(), 'MM/DD/YY h:mm a');

  return {
    test_mode: config.NODE_ENV === 'production' ? 0 : 1,
    clientId: config.HELLOSIGN_CLIENT_ID,
    template_id: '9f5fcf47c0ce797d2beed7c62e9ae62487259298', // TODO: parameterize depending on what document
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
        const options = getHelloSignOptions(patient, input.documentType);
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

    addJobToQueue('processHelloSign', {
      userId,
      patientId: input.patientId,
      requestId: input.requestId,
      documentType: input.documentType,
    });
  });

  return true;
}
