import { transaction } from 'objection';
import { IComputedFieldFlagCreateInput, IRootMutationType } from 'schema';
import ComputedFieldFlag from '../models/computed-field-flag';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IComputedFieldFlagCreateArgs {
  input: IComputedFieldFlagCreateInput;
}

export async function computedFieldFlagCreate(
  root: any,
  { input }: IComputedFieldFlagCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['computedFieldFlagCreate']> {
  return transaction(testTransaction || ComputedFieldFlag.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'view',
      'patientAnswer',
      txn,
      input.patientAnswerId,
    );

    return ComputedFieldFlag.create(
      {
        patientAnswerId: input.patientAnswerId,
        reason: input.reason || null,
        userId: userId!,
      },
      txn,
    );
  });
}
