import { IClinicCreateInput, IClinicNode, IRootMutationType, IRootQueryType } from 'schema';
import { IPaginationOptions } from '../db';
import Clinic from '../models/clinic';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IClinicCreateArgs {
  input: IClinicCreateInput;
}

export interface IResolveClinicOptions {
  clinicId: string;
}

export async function clinicCreate(
  root: any,
  { input }: IClinicCreateArgs,
  { userRole, txn }: IContext,
): Promise<IRootMutationType['clinicCreate']> {
  const { departmentId } = input;
  await accessControls.isAllowed(userRole, 'create', 'clinic');

  const clinic = await Clinic.getBy({ fieldName: 'departmentId', field: departmentId }, txn);

  if (clinic) {
    throw new Error(`Cannot create clinic: departmentId already exists for ${departmentId}`);
  } else {
    return Clinic.create(input, txn);
  }
}

export async function resolveClinic(
  root: any,
  { clinicId }: IResolveClinicOptions,
  { userRole, txn }: IContext,
): Promise<IRootQueryType['clinic']> {
  await accessControls.isAllowed(userRole, 'view', 'clinic');

  return Clinic.get(clinicId, txn);
}

export async function resolveClinics(
  root: any,
  { pageNumber, pageSize }: IPaginationOptions,
  { userRole, txn }: IContext,
): Promise<IRootQueryType['clinics']> {
  await accessControls.isAllowed(userRole, 'view', 'clinic');

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
}
