import { IClinicCreateInput } from 'schema';
import Clinic from '../models/clinic';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IClinicCreateArgs {
  input: IClinicCreateInput;
}

interface IResolveClinicOptions {
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
  root: any, { clinicId }: IResolveClinicOptions, { userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'clinic');

  return await Clinic.get(clinicId);
}
