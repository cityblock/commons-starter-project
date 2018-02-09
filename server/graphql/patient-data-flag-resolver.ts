import { IPatientDataFlagCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import PatientDataFlag from '../models/patient-data-flag';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IPatientDataFlagCreateArgs {
  input: IPatientDataFlagCreateInput;
}

export interface IResolvePatientDataFlagsForPatientOptions {
  patientId: string;
}

export async function patientDataFlagCreate(
  root: any,
  { input }: IPatientDataFlagCreateArgs,
  { userRole, userId, txn }: IContext,
): Promise<IRootMutationType['patientDataFlagCreate']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);
  checkUserLoggedIn(userId);

  return PatientDataFlag.create(
    {
      ...input,
      suggestedValue: input.suggestedValue || undefined,
    },
    txn,
  );
}

export async function resolvePatientDataFlagsForPatient(
  root: any,
  { patientId }: IResolvePatientDataFlagsForPatientOptions,
  { userRole, txn, userId }: IContext,
): Promise<IRootQueryType['patientDataFlagsForPatient']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);
  checkUserLoggedIn(userId);

  return PatientDataFlag.getAllForPatient(patientId, txn);
}
