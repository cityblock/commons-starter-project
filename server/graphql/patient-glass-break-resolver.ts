import { IPatientGlassBreakCreateInput, IRootMutationType, IRootQueryType } from 'schema';
import PatientGlassBreak from '../models/patient-glass-break';
import checkUserPermissions, { validateGlassBreakNotNeeded } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
}

export interface IPatientGlassBreakCreateArgs {
  input: IPatientGlassBreakCreateInput;
}

export async function patientGlassBreakCreate(
  root: any,
  { input }: IPatientGlassBreakCreateArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['patientGlassBreakCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'patientGlassBreak', txn);

  return PatientGlassBreak.create(
    {
      userId: userId!,
      patientId: input.patientId,
      reason: input.reason,
      note: input.note || null,
    },
    txn,
  );
}

export async function resolvePatientGlassBreaksForUser(
  root: any,
  input: {},
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientGlassBreaksForUser']> {
  await checkUserPermissions(userId, permissions, 'view', 'patientGlassBreak', txn);

  return PatientGlassBreak.getForCurrentUserSession(userId!, txn);
}

export async function resolvePatientGlassBreakCheck(
  root: any,
  { patientId }: IQuery,
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['patientGlassBreakCheck']> {
  await checkUserPermissions(userId, permissions, 'view', 'patientGlassBreak', txn);

  const isGlassBreakNotNeeded = await validateGlassBreakNotNeeded(
    userId!,
    'patient',
    patientId,
    txn,
  );

  return {
    patientId,
    isGlassBreakNotNeeded,
  };
}
