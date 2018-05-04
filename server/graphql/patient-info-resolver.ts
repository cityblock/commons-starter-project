import { isNil, omitBy } from 'lodash';
import {
  IPatientInfoEditInput,
  IPatientNeedToKnow,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientInfoEditOptions {
  input: IPatientInfoEditInput;
}

export interface IQuery {
  patientInfoId: string;
}

export async function resolvePatientNeedToKnow(
  root: any,
  { patientInfoId }: IQuery,
  { permissions, userId, txn }: IContext,
): Promise<IPatientNeedToKnow> {
  const patientInfo = await PatientInfo.get(patientInfoId, txn);

  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientInfo.patientId);

  return { text: patientInfo.needToKnow };
}

export interface IPatientNeedToKnowEditOptions {
  input: {
    patientInfoId: string;
    text: string;
  };
}

export async function patientNeedToKnowEdit(
  root: any,
  { input }: IPatientNeedToKnowEditOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientNeedToKnow']> {
  const { patientInfoId, text } = input;
  const patientInfo = await PatientInfo.get(patientInfoId, txn);

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientInfo.patientId);
  const updatedPatientInfo = await PatientInfo.edit(
    { needToKnow: text, updatedById: userId! },
    patientInfoId,
    txn,
  );

  return { text: updatedPatientInfo.needToKnow };
}

export async function patientInfoEdit(
  source: any,
  { input }: IPatientInfoEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientInfoEdit']> {
  const patientInfo = await PatientInfo.get(input.patientInfoId, txn);

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientInfo.patientId);

  const filtered = omitBy<IPatientInfoEditInput>(input, isNil);
  logger.log(`EDIT patient info ${input.patientInfoId} by ${userId}`);

  return PatientInfo.edit({ ...(filtered as any), updatedById: userId }, input.patientInfoId, txn);
}
/* tslint:enable check-is-allowed */
