// NOTE: THIS IS AN UNAUTHENTICATED RESOLVER! BEWARE!
import { IRootQueryType } from 'schema';
import ComputedField from '../models/computed-field';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

/* tslint:disable:check-is-allowed */
export async function resolveComputedFieldsSchema(
  root: any,
  args: any,
  { txn, userId, permissions }: IContext,
): Promise<IRootQueryType['computedFieldsSchema']> {
  await checkUserPermissions(userId, permissions, 'view', 'computedField', txn);
  const computedFields = await ComputedField.getForSchema({ orderBy: 'slug', order: 'asc' }, txn);

  const formattedComputedFields = computedFields.map(computedField => ({
    slug: computedField.slug,
    dataType: computedField.dataType,
    values: computedField.question.answers.map(answer => answer.value),
  }));

  return {
    computedFields: formattedComputedFields,
  };
}
/* tslint:enable:check-is-allowed */
