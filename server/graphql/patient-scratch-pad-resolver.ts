import { IPatientScratchPadEditInput, IRootMutationType, IRootQueryType } from 'schema';
import PatientScratchPad from '../models/patient-scratch-pad';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
  glassBreakId: string | null;
}

export interface IPatientScratchPadEditOptions {
  input: IPatientScratchPadEditInput;
}

export async function resolvePatientScratchPad(
  root: any,
  { patientId, glassBreakId }: IQuery,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScratchPad']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);
  await validateGlassBreak(userId!, permissions, 'patient', patientId, txn, glassBreakId);

  const patientScratchPad = await PatientScratchPad.getForPatientAndUser(
    { patientId, userId: userId! },
    txn,
  );
  // if there is already a scratch pad, return it
  if (patientScratchPad) return patientScratchPad;
  // otherwise create it for the given user and patient combination
  const newScratchPad = await PatientScratchPad.create({ patientId, userId: userId! }, txn);

  return newScratchPad;
}

export async function patientScratchPadEdit(
  root: any,
  { input }: IPatientScratchPadEditOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientScratchPadEdit']> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    input.patientScratchPadId,
  );

  return PatientScratchPad.update(input.patientScratchPadId, { body: input.body }, txn);
}
