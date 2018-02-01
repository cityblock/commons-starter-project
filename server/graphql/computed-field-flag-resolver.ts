import { IComputedFieldFlagCreateInput } from 'schema';
import ComputedFieldFlag from '../models/computed-field-flag';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IComputedFieldFlagCreateArgs {
  input: IComputedFieldFlagCreateInput;
}

export async function computedFieldFlagCreate(
  root: any,
  { input }: IComputedFieldFlagCreateArgs,
  { userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'computedFieldFlag');
  checkUserLoggedIn(userId);

  return ComputedFieldFlag.create(
    {
      patientAnswerId: input.patientAnswerId,
      reason: input.reason || null,
      userId: userId!,
    },
    txn,
  );
}
