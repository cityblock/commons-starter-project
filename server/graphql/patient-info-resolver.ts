import { isNil, omitBy } from 'lodash';
import { transaction } from 'objection';
import {
  IPatientInfoEditInput,
  IPatientNeedToKnow,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import { addJobToQueue } from '../helpers/queue-helpers';
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
  { permissions, userId, testTransaction }: IContext,
): Promise<IPatientNeedToKnow> {
  return transaction(testTransaction || PatientInfo.knex(), async txn => {
    const patientInfo = await PatientInfo.get(patientInfoId, txn);

    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientInfo.patientId);

    return { text: patientInfo.needToKnow };
  });
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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientNeedToKnow']> {
  const { patientInfoId, text } = input;
  return transaction(testTransaction || PatientInfo.knex(), async txn => {
    const patientInfo = await PatientInfo.get(patientInfoId, txn);

    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientInfo.patientId);
    const updatedPatientInfo = await PatientInfo.edit(
      { needToKnow: text, updatedById: userId! },
      patientInfoId,
      txn,
    );

    return { text: updatedPatientInfo.needToKnow };
  });
}

export async function patientInfoEdit(
  source: any,
  { input }: IPatientInfoEditOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['patientInfoEdit']> {
  return transaction(testTransaction || PatientInfo.knex(), async txn => {
    const patientInfo = await PatientInfo.get(input.patientInfoId, txn);

    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientInfo.patientId);

    const filtered = omitBy<IPatientInfoEditInput>(input, isNil);
    logger.log(`EDIT patient info ${input.patientInfoId} by ${userId}`);

    // if changing patient preferred name, enqueue job to notify care team worker
    if (filtered.preferredName !== undefined) {
      addJobToQueue('patientContactEdit', {
        patientId: patientInfo.patientId,
        type: 'editPreferredName',
        prevPreferredName: patientInfo.preferredName,
      });
    }

    return PatientInfo.edit(
      { ...(filtered as any), updatedById: userId },
      input.patientInfoId,
      txn,
    );
  });
}
