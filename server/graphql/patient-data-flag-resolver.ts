import { IPatientDataFlagCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import PatientDataFlag from '../models/patient-data-flag';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientDataFlagCreateArgs {
  input: IPatientDataFlagCreateInput;
}

export interface IResolvePatientDataFlagsForPatientOptions {
  patientId: string;
}

export async function patientDataFlagCreate(
  root: any,
  { input }: IPatientDataFlagCreateArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientDataFlagCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

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
  { permissions, txn, userId }: IContext,
): Promise<IRootQueryType['patientDataFlagsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  return PatientDataFlag.getAllForPatient(patientId, txn);
}
