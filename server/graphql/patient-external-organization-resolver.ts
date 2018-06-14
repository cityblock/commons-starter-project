import { isNil, isNull, omitBy } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  IAddressCreateInput,
  IAddressInput,
  IPatientExternalOrganizationCreateInput,
  IPatientExternalOrganizationDeleteInput,
  IPatientExternalOrganizationEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Address from '../models/address';
import ComputedPatientStatus from '../models/computed-patient-status';
import PatientExternalOrganization from '../models/patient-external-organization';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientExternalOrganizationCreateOptions {
  input: IPatientExternalOrganizationCreateInput;
}

export interface IPatientExternalOrganizationEditOptions {
  input: IPatientExternalOrganizationEditInput;
}

export interface IPatientExternalOrganizationDeleteOptions {
  input: IPatientExternalOrganizationDeleteInput;
}

export interface IQuery {
  patientId: string;
}

export async function resolvePatientExternalOrganizationsForPatient(
  source: any,
  { patientId }: IQuery,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['patientExternalOrganizations']> {
  return transaction(testTransaction || PatientExternalOrganization.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET patient external organizations for ${patientId} by ${userId}`);
    return PatientExternalOrganization.getAllForPatient(patientId, txn);
  });
}

export async function patientExternalOrganizationDelete(
  source: any,
  { input }: IPatientExternalOrganizationDeleteOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['patientExternalOrganizationDelete']> {
  return transaction(testTransaction || PatientExternalOrganization.knex(), async txn => {
    const patientExternalOrganization = await PatientExternalOrganization.get(
      input.patientExternalOrganizationId,
      txn,
    );

    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'patient',
      txn,
      patientExternalOrganization.patientId,
    );
    logger.log(
      `DELETE patient external organization ${input.patientExternalOrganizationId} by ${userId}`,
    );
    const { id, address } = patientExternalOrganization;

    if (address) {
      await Address.delete(address.id, txn);
    }
    const deletedPatientExternalOrganization = await PatientExternalOrganization.delete(id, txn);
    await ComputedPatientStatus.updateForPatient(
      patientExternalOrganization.patientId,
      userId!,
      txn,
    );
    return deletedPatientExternalOrganization;
  });
}

export async function patientExternalOrganizationCreate(
  source: any,
  { input }: IPatientExternalOrganizationCreateOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['patientExternalOrganizationCreate']> {
  return transaction(testTransaction || PatientExternalOrganization.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'patient', txn, input.patientId);

    logger.log(`CREATE patient external organization for patient ${input.patientId} by ${userId}`);
    const filtered = omitBy<IPatientExternalOrganizationCreateInput>(input, isNil) as any;

    filtered.addressId = await createAddress(filtered.address, userId!, txn);
    delete filtered.address;

    const patientExternalOrganization = await PatientExternalOrganization.create(filtered, txn);

    await ComputedPatientStatus.updateForPatient(input.patientId, userId!, txn);
    return PatientExternalOrganization.get(patientExternalOrganization.id, txn);
  });
}

export async function patientExternalOrganizationEdit(
  source: any,
  { input }: IPatientExternalOrganizationEditOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['patientExternalOrganizationEdit']> {
  return transaction(testTransaction || PatientExternalOrganization.knex(), async txn => {
    const patientExternalOrganization = await PatientExternalOrganization.get(
      input.patientExternalOrganizationId,
      txn,
    );

    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'patient',
      txn,
      patientExternalOrganization.patientId,
    );
    logger.log(
      `EDIT patient external organization ${input.patientExternalOrganizationId} by ${userId}`,
    );

    const filtered = omitBy<IPatientExternalOrganizationEditInput>(input, isNil) as any;
    delete filtered.address;

    filtered.addressId = await updateAddress(
      input.patientExternalOrganizationId,
      userId!,
      input.address,
      txn,
    );

    const updatedPatientExternalOrganization = await PatientExternalOrganization.edit(
      filtered,
      input.patientExternalOrganizationId,
      txn,
    );

    await ComputedPatientStatus.updateForPatient(
      patientExternalOrganization.patientId,
      userId!,
      txn,
    );

    return updatedPatientExternalOrganization;
  });
}

async function createAddress(
  addressInput: IAddressCreateInput | null | undefined,
  userId: string,
  txn: Transaction,
) {
  const filteredInput = omitBy<IAddressCreateInput>(addressInput, field => !field) as any;

  if (Object.keys(filteredInput).length) {
    filteredInput.updatedById = userId;
    const address = await Address.create(filteredInput, txn);

    return address.id;
  }
}

async function updateAddress(
  patientExternalOrganizationId: string,
  userId: string,
  addressInput: IAddressInput | null | undefined,
  txn: Transaction,
) {
  if (!addressInput) {
    return;
  }

  const organization = await PatientExternalOrganization.get(patientExternalOrganizationId, txn);

  // if no address currently exists for this organization
  if (!organization.address) {
    return createAddress(addressInput, userId, txn);
  }

  // delete if the address exists and the address input is all empty
  const shouldDelete = !Object.keys(omitBy(addressInput, input => !input)).length;
  if (shouldDelete) {
    await Address.delete(organization.address.id, txn);
    return null;
  }

  // edit existing organization address
  const filteredInput = omitBy<IAddressInput>(addressInput, isNull) as any;
  await Address.edit({ ...filteredInput, updatedById: userId }, organization.address.id, txn);
  return organization.address.id;
}
/* tslint:enable check-is-allowed */
