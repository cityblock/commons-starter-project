import { isNil, omitBy } from 'lodash';
import { IPatientDocumentCreateInput, IPatientDocumentDeleteInput, IRootQueryType } from 'schema';
import PatientDocument from '../models/patient-document';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolvePatientDocumentsOptions {
  patientId: string;
}

export async function resolvePatientDocuments(
  source: any,
  { patientId }: IResolvePatientDocumentsOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patientDocuments']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET all documents for patient ${patientId} by ${userId}`, 2);

  return PatientDocument.getAllForPatient(patientId, txn);
}

export interface IPatientDocumentCreateOptions {
  input: IPatientDocumentCreateInput;
}

export async function patientDocumentCreate(
  root: any,
  { input }: IPatientDocumentCreateOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<PatientDocument> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IPatientDocumentCreateInput>(input, isNil) as any;
  logger.log(`CREATE document for patient ${input.patientId} by ${userId}`, 2);

  return PatientDocument.create(filtered, txn);
}

export interface IPatientDocumentDeleteOptions {
  input: IPatientDocumentDeleteInput;
}

export async function patientDocumentDelete(
  root: any,
  { input }: IPatientDocumentDeleteOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<PatientDocument> {
  const document = await PatientDocument.get(input.patientDocumentId, txn);
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, document.patientId);

  logger.log(`DELETE document ${input.patientDocumentId} by ${userId}`, 2);

  return PatientDocument.delete(input.patientDocumentId, userId!, txn);
}
