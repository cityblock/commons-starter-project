import { withFilter } from 'graphql-subscriptions';
import { isNil, omitBy } from 'lodash';
import { transaction } from 'objection';
import {
  DocumentTypeOptions,
  IPatientDocumentCreateInput,
  IPatientDocumentDeleteInput,
  IPatientDocumentSignedUrlCreateInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientDocument from '../models/patient-document';
import PubSub from '../subscriptions';
import { loadPatientDocumentUrl } from './shared/gcs/helpers';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolvePatientDocumentsOptions {
  patientId: string;
}

export interface IResolvePatientDocumentsByTypeOptions {
  patientId: string;
  documentType: DocumentTypeOptions;
}

export async function resolvePatientDocuments(
  source: any,
  { patientId }: IResolvePatientDocumentsOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['patientDocuments']> {
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);
    logger.log(`GET all documents for patient ${patientId} by ${userId}`);
    return PatientDocument.getAllForPatient(patientId, txn);
  });
}

export async function resolvePatientDocumentsByType(
  root: {},
  { patientId, documentType }: IResolvePatientDocumentsByTypeOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['patientDocumentsByType']> {
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);
    logger.log(`GET documents of type ${documentType} for patient ${patientId} by ${userId}`);

    return PatientDocument.getByDocumentTypeForPatient(patientId, documentType, txn);
  });
}

export interface IPatientDocumentCreateOptions {
  input: IPatientDocumentCreateInput;
}

export async function patientDocumentCreate(
  root: any,
  { input }: IPatientDocumentCreateOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<PatientDocument> {
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    const filtered = omitBy<IPatientDocumentCreateInput>(input, isNil) as any;
    filtered.uploadedById = userId;
    logger.log(`CREATE document for patient ${input.patientId} by ${userId}`);

    return PatientDocument.create(filtered, txn);
  });
}

export interface IPatientDocumentDeleteOptions {
  input: IPatientDocumentDeleteInput;
}

export async function patientDocumentDelete(
  root: any,
  { input }: IPatientDocumentDeleteOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<PatientDocument> {
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    const document = await PatientDocument.get(input.patientDocumentId, txn);
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, document.patientId);

    logger.log(`DELETE document ${input.patientDocumentId} by ${userId}`);

    return PatientDocument.delete(input.patientDocumentId, userId!, txn);
  });
}

export interface IPatientDocumentSignedUrlCreateOptions {
  input: IPatientDocumentSignedUrlCreateInput;
}

export async function patientDocumentSignedUrlCreate(
  root: any,
  { input }: IPatientDocumentSignedUrlCreateOptions,
  { permissions, userId, testTransaction, testConfig }: IContext,
): Promise<IRootMutationType['patientDocumentSignedUrlCreate']> {
  const { patientId, action, documentId, contentType } = input;
  if (!patientId) {
    throw new Error('Must provide patient id');
  }
  const permissionAction = action === 'read' ? 'view' : 'edit';
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    await checkUserPermissions(userId, permissions, permissionAction, 'patient', txn, patientId);

    const signedUrl = await loadPatientDocumentUrl(
      patientId,
      action,
      documentId,
      contentType,
      testConfig,
    );

    if (!signedUrl) {
      throw new Error('Something went wrong, please try again.');
    }

    return { signedUrl };
  });
}

export async function patientDocumentSubscribe(
  root: any,
  query: { patientId: string },
  context: IContext,
) {
  const { permissions, userId, testTransaction, logger } = context;
  return transaction(testTransaction || PatientDocument.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, query.patientId);

    logger.log(`SUBSCRIBE patient documents for patient ${query.patientId}`);

    const pubsub = PubSub.get();
    // only listen to messages for given patient
    return withFilter(
      () => pubsub.asyncIterator('patientDocumentCreated'),
      payload => {
        return payload.patientId === query.patientId;
      },
    )(root, query, context);
  });
}
