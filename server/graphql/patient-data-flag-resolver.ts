import { transaction } from 'objection';
import { IPatientDataFlagCreateInput, IRootMutationType } from 'schema';
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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['patientDataFlagCreate']> {
  return transaction(testTransaction || PatientDataFlag.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    return PatientDataFlag.create(
      {
        ...input,
        userId: userId!,
        suggestedValue: input.suggestedValue || undefined,
        notes: input.notes || undefined,
      },
      txn,
    );
  });
}
