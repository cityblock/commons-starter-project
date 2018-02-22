import { isNil, omitBy } from 'lodash';
import { IPatientInfoEditInput, IRootMutationType } from 'schema';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientInfoEditOptions {
  input: IPatientInfoEditInput;
}

export async function patientInfoEdit(
  source: any,
  { input }: IPatientInfoEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientInfoEdit']> {
  const patientInfo = await PatientInfo.get(input.patientInfoId, txn);

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientInfo.patientId);

  const filtered = omitBy<IPatientInfoEditInput>(input, isNil);
  logger.log(`EDIT patient info ${input.patientInfoId} by ${userId}`, 2);

  return PatientInfo.edit({ ...(filtered as any), updatedById: userId }, input.patientInfoId, txn);
}
/* tslint:enable check-is-allowed */
