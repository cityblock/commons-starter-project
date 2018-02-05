import { isNil, omitBy } from 'lodash';
import { IPatientInfo, IPatientInfoEditInput } from 'schema';
import PatientInfo from '../models/patient-info';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IPatientInfoEditOptions {
  input: IPatientInfoEditInput;
}

export async function patientInfoEdit(
  source: any,
  { input }: IPatientInfoEditOptions,
  { userRole, userId, logger, txn }: IContext,
): Promise<IPatientInfo> {
  const patientInfo = await PatientInfo.get(input.patientInfoId, txn);
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', patientInfo.patientId, userId);
  checkUserLoggedIn(userId);

  const filtered = omitBy<IPatientInfoEditInput>(input, isNil);
  logger.log(`EDIT patient info ${input.patientInfoId} by ${userId}`, 2);

  return PatientInfo.edit(filtered as any, input.patientInfoId, txn);
}
/* tslint:enable check-is-allowed */
