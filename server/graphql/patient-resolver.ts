import { isNil, omitBy } from 'lodash';
import { Transaction } from 'objection';
import {
  IPatient,
  IPatientEditInput,
  IPatientForDashboardEdges,
  IPatientScratchPad,
  IPatientSearchResult,
  IPatientSearchResultEdges,
  IPatientSearchResultNode,
  IPatientSetupInput,
} from 'schema';
import { getAthenaPatientIdFromCreate } from '../apis/redox/formatters';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Address from '../models/address';
import CareTeam from '../models/care-team';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import PatientAddress from '../models/patient-address';
import PatientInfo from '../models/patient-info';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
}

export interface IPatientSearchOptions extends IPaginationOptions {
  query: string;
}

export interface IPatientComputedListOptions extends IPaginationOptions {
  answerId: string;
}

export async function resolvePatient(
  root: any,
  { patientId }: IQuery,
  { userRole, userId, logger, txn }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);
  logger.log(`GET patient ${patientId} by ${userId}`, 2);
  return Patient.get(patientId, txn);
}

export interface IPatientEditOptions {
  input: IPatientEditInput;
}

export async function patientEdit(
  source: any,
  { input }: IPatientEditOptions,
  { userRole, userId, logger, txn }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);

  const filtered = omitBy<IPatientEditInput>(input, isNil);
  logger.log(`EDIT patient ${input.patientId} by ${userId}`, 2);
  return Patient.edit(filtered as any, input.patientId, txn);
}

export interface IPatientSetupOptions {
  input: IPatientSetupInput;
}

export async function patientSetup(
  source: any,
  { input }: IPatientSetupOptions,
  context: IContext,
): Promise<IPatient> {
  const { redoxApi, userRole, userId, logger, txn } = context;
  await accessControls.isAllowedForUser(userRole, 'create', 'patient');
  checkUserLoggedIn(userId);

  const patientInfoOptions = {
    gender: input.gender,
    language: input.language,
  };

  const patient = await Patient.setup(input, patientInfoOptions, userId!, txn);

  if (input.zip) {
    const address = await Address.create({ zip: input.zip, updatedBy: userId! }, txn);
    await PatientAddress.create({ patientId: patient.id, addressId: address.id }, txn);
    await PatientInfo.edit(
      { primaryAddressId: address.id, updatedBy: userId! },
      patient.patientInfo.id,
      context.txn,
    );
  }

  const department = await Clinic.get(input.homeClinicId, txn);
  const redoxPatient = await redoxApi.patientCreate(
    {
      id: patient.id,
      firstName: input.firstName,
      homeClinicId: String(department.departmentId),
      middleName: input.middleName,
      lastName: input.lastName,
      gender: input.gender,
      zip: input.zip,
      dateOfBirth: input.dateOfBirth,
      maritalStatus: input.maritalStatus,
      race: input.race,
      ssn: input.ssn,
      language: input.language,
      email: input.email,
      homePhone: input.homePhone,
      mobilePhone: input.mobilePhone,
      consentToCall: input.consentToCall,
      consentToText: input.consentToText,
      insuranceType: input.insuranceType,
      patientRelationshipToPolicyHolder: input.patientRelationshipToPolicyHolder,
      memberId: input.memberId,
      policyGroupNumber: input.policyGroupNumber,
      issueDate: input.issueDate,
      expirationDate: input.expirationDate,
      suffix: null,
      preferredName: null,
      city: null,
      address1: null,
      country: null,
      county: null,
      state: null,
    },
    txn,
  );

  const athenaPatientId = getAthenaPatientIdFromCreate(redoxPatient);
  if (!athenaPatientId) {
    throw new Error('Athena patient was not correctly created');
  }
  const patientWithAthenaId = await Patient.addAthenaPatientId(athenaPatientId, patient.id, txn);

  await CareTeam.create(
    {
      userId: userId!,
      patientId: patientWithAthenaId.id,
    },
    txn,
  );

  logger.log(`SETUP patient ${patientWithAthenaId.id} by ${userId}`, 2);
  return patientWithAthenaId;
}

export interface IEditPatientRequiredFields {
  patientId: string;
}

export async function resolvePatientScratchPad(
  root: any,
  { patientId }: IQuery,
  { userRole, userId, txn }: IContext,
): Promise<IPatientScratchPad> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId, txn);

  return { text: patient.scratchPad };
}

export interface IPatientScratchPadEditOptions {
  input: {
    patientId: string;
    text: string;
  };
}

export async function patientScratchPadEdit(
  root: any,
  { input }: IPatientScratchPadEditOptions,
  { userRole, userId, txn }: IContext,
): Promise<IPatientScratchPad> {
  const { patientId, text } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', patientId, userId);

  const patient = await Patient.edit({ scratchPad: text }, patientId, txn);

  return { text: patient.scratchPad };
}

export async function resolvePatientSearch(
  root: any,
  { query, pageNumber, pageSize }: IPatientSearchOptions,
  { userRole, userId, txn }: IContext,
): Promise<IPatientSearchResultEdges> {
  let patients: IPaginatedResults<IPatientSearchResult>;
  await accessControls.isAllowedForUser(userRole, 'view', 'patient');
  checkUserLoggedIn(userId);

  patients = await Patient.search(query, { pageNumber, pageSize }, userId!, txn);

  const patientEdges = patients.results.map(
    (patient, i) => formatRelayEdge(patient, patient.id) as IPatientSearchResultNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < patients.total;

  return {
    edges: patientEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
    totalCount: patients.total,
  };
}

export async function resolvePatientDashboardBuilder(
  root: any,
  { pageNumber, pageSize }: IPaginationOptions,
  { userRole, userId, txn }: IContext,
  patientEndpoint: (
    pageOptions: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ) => Promise<IPaginatedResults<Patient>>,
): Promise<IPatientForDashboardEdges> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient');
  checkUserLoggedIn(userId);

  const patients = await patientEndpoint.bind(Patient)({ pageNumber, pageSize }, userId!, txn);

  const patientEdges = patients.results.map((patient: Patient) =>
    formatRelayEdge(patient, patient.id),
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < patients.total;

  return {
    edges: patientEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
    totalCount: patients.total,
  };
}

/* tslint:disable check-is-allowed */
export async function resolvePatientsWithUrgentTasks(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithUrgentTasks,
  );
}

export async function resolvePatientsNewToCareTeam(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsNewToCareTeam,
  );
}

export async function resolvePatientsWithPendingSuggestions(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithPendingSuggestions,
  );
}

export async function resolvePatientsWithMissingInfo(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithMissingInfo,
  );
}

export async function resolvePatientsWithNoRecentEngagement(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithNoRecentEngagement,
  );
}

export async function resolvePatientsWithOutOfDateMAP(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithOutOfDateMAP,
  );
}

export async function resolvePatientsForComputedList(
  root: any,
  { answerId, pageNumber, pageSize }: IPatientComputedListOptions,
  { userRole, userId, txn }: IContext,
): Promise<IPatientForDashboardEdges> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient');
  checkUserLoggedIn(userId);

  const patients = await Patient.getPatientsForComputedList(
    { pageNumber, pageSize },
    userId!,
    answerId,
    txn,
  );

  const patientEdges = patients.results.map((patient: Patient) =>
    formatRelayEdge(patient, patient.id),
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < patients.total;

  return {
    edges: patientEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
    totalCount: patients.total,
  };
}
/* tslint:enable check-is-allowed */
