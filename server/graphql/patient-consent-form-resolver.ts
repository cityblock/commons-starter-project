import { find } from 'lodash';
import {
  IPatientConsentFormCreateInput,
  IPatientConsentFormDeleteInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ConsentForm from '../models/consent-form';
import PatientConsentForm from '../models/patient-consent-form';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientConsentFormCreateArgs {
  input: IPatientConsentFormCreateInput;
}

export interface IPatientConsentFormDeleteArgs {
  input: IPatientConsentFormDeleteInput;
}

export async function patientConsentFormCreate(
  root: any,
  { input }: IPatientConsentFormCreateArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientConsentFormCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const patientConsentForm = await PatientConsentForm.create({ userId, ...input } as any, txn);
  const consentForm = await ConsentForm.get(input.formId, txn);

  return {
    patientConsentFormId: patientConsentForm.id,
    patientId: input.patientId,
    userId: userId!,
    formId: input.formId,
    signedAt: input.signedAt,
    title: consentForm.title,
  };
}

export async function resolvePatientConsentFormsForPatient(
  root: any,
  args: { patientId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientConsentFormsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
  const { patientId } = args;

  const consentForms = await ConsentForm.getAll(txn);
  const patientConsentForms = await PatientConsentForm.getAllForPatient(patientId, txn);

  return consentForms.map(consentForm => {
    const patientConsentForm = find(patientConsentForms, ['formId', consentForm.id]);

    return {
      patientConsentFormId: patientConsentForm ? patientConsentForm.id : null,
      patientId,
      userId: patientConsentForm ? patientConsentForm.userId : null,
      formId: consentForm.id,
      title: consentForm.title,
      signedAt: patientConsentForm ? patientConsentForm.signedAt : null,
    };
  });
}

export async function patientConsentFormDelete(
  root: any,
  args: IPatientConsentFormDeleteArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientConsentFormDelete']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn);

  const patientConsentForm = await PatientConsentForm.delete(
    args.input.patientConsentFormId,
    userId!,
    txn,
  );
  const consentForm = await ConsentForm.get(patientConsentForm.formId, txn);

  return {
    patientConsentFormId: patientConsentForm.id,
    patientId: patientConsentForm.patientId,
    userId: userId!,
    formId: patientConsentForm.formId,
    signedAt: patientConsentForm.signedAt,
    title: consentForm.title,
  };
}
