import { transaction } from 'objection';
import { IClinicCreateInput, IClinicNode, IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import Clinic from '../models/clinic';
import checkUserPermissions from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IClinicCreateArgs {
  input: IClinicCreateInput;
}

export interface IResolveClinicOptions {
  clinicId: string;
}

export async function resolveClinic(
  root: any,
  { clinicId }: IResolveClinicOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['clinic']> {
  return transaction(testTransaction || Clinic.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'clinic', txn);

    return Clinic.get(clinicId, txn);
  });
}

export async function resolveClinics(
  root: any,
  { pageNumber, pageSize }: IPaginationOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['clinics']> {
  return transaction(testTransaction || Clinic.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'clinic', txn);

    const clinics = await Clinic.getAll({ pageNumber, pageSize }, txn);
    const clinicEdges = clinics.results.map(
      (clinic, i) => formatRelayEdge(clinic, clinic.id) as IClinicNode,
    );

    const hasPreviousPage = pageNumber !== 0;
    const hasNextPage = (pageNumber + 1) * pageSize < clinics.total;

    return {
      edges: clinicEdges,
      pageInfo: {
        hasPreviousPage,
        hasNextPage,
      },
    };
  });
}
