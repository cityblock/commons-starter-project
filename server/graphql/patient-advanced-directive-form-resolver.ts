import { find } from 'lodash';
import {
  IPatientAdvancedDirectiveFormCreateInput,
  IPatientAdvancedDirectiveFormDeleteInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import AdvancedDirectiveForm from '../models/advanced-directive-form';
import PatientAdvancedDirectiveForm from '../models/patient-advanced-directive-form';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientAdvancedDirectiveFormCreateArgs {
  input: IPatientAdvancedDirectiveFormCreateInput;
}

export interface IPatientAdvancedDirectiveFormDeleteArgs {
  input: IPatientAdvancedDirectiveFormDeleteInput;
}

export async function patientAdvancedDirectiveFormCreate(
  root: any,
  { input }: IPatientAdvancedDirectiveFormCreateArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientAdvancedDirectiveFormCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.create(
    {
      userId,
      ...input,
    } as any,
    txn,
  );
  const advancedDirectiveForm = await AdvancedDirectiveForm.get(input.formId, txn);

  return {
    patientAdvancedDirectiveFormId: patientAdvancedDirectiveForm.id,
    patientId: input.patientId,
    userId: userId!,
    formId: input.formId,
    signedAt: input.signedAt,
    title: advancedDirectiveForm.title,
  };
}

export async function resolvePatientAdvancedDirectiveFormsForPatient(
  root: any,
  args: { patientId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientAdvancedDirectiveFormsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
  const { patientId } = args;

  const advancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
  const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
    patientId,
    txn,
  );

  return advancedDirectiveForms.map(advancedDirectiveForm => {
    const patientAdvancedDirectiveForm = find(patientAdvancedDirectiveForms, [
      'formId',
      advancedDirectiveForm.id,
    ]);

    return {
      patientAdvancedDirectiveFormId: patientAdvancedDirectiveForm
        ? patientAdvancedDirectiveForm.id
        : null,
      patientId,
      userId: patientAdvancedDirectiveForm ? patientAdvancedDirectiveForm.userId : null,
      formId: advancedDirectiveForm.id,
      title: advancedDirectiveForm.title,
      signedAt: patientAdvancedDirectiveForm ? patientAdvancedDirectiveForm.signedAt : null,
    };
  });
}

export async function patientAdvancedDirectiveFormDelete(
  root: any,
  args: IPatientAdvancedDirectiveFormDeleteArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientAdvancedDirectiveFormDelete']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn);

  const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.delete(
    args.input.patientAdvancedDirectiveFormId,
    userId!,
    txn,
  );
  const advancedDirectiveForm = await AdvancedDirectiveForm.get(
    patientAdvancedDirectiveForm.formId,
    txn,
  );

  return {
    patientAdvancedDirectiveFormId: patientAdvancedDirectiveForm.id,
    patientId: patientAdvancedDirectiveForm.patientId,
    userId: userId!,
    formId: patientAdvancedDirectiveForm.formId,
    signedAt: patientAdvancedDirectiveForm.signedAt,
    title: advancedDirectiveForm.title,
  };
}
