import { IClinicCreateInput, IClinicNode } from 'schema';
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
  { userRole }: IContext,
) {
  const { departmentId } = input;
  await accessControls.isAllowed(userRole, 'create', 'clinic');

  const clinic = await Clinic.getBy('departmentId', departmentId);

  if (clinic) {
    throw new Error(`Cannot create clinic: departmentId already exists for ${departmentId}`);
  } else {
    return await Clinic.create(input);
  }
}

export async function resolveClinic(
  root: any,
  { clinicId }: IResolveClinicOptions,
  { userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'clinic');

  return await Clinic.get(clinicId);
}

export async function resolveClinics(
  root: any,
  { pageNumber, pageSize }: IPaginationOptions,
  { userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'clinic');

  const clinics = await Clinic.getAll({ pageNumber, pageSize });
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
