import { isNil, omitBy } from 'lodash';
import { Transaction } from 'objection';
import {
  IPatientCoreIdentityVerifyInput,
  IPatientEditInput,
  IPatientFilterOptions,
  IPatientForDashboardEdges,
  IPatientNeedToKnow,
  IPatientTableRow,
  IPatientTableRowEdges,
  IPatientTableRowNode,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Patient from '../models/patient';
import checkUserPermissions, { getBusinessToggles } from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

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
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['patient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET patient ${patientId} by ${userId}`, 2);

  return Patient.get(patientId, txn);
}

export interface IPatientEditOptions {
  input: IPatientEditInput;
}

export async function patientEdit(
  source: any,
  { input }: IPatientEditOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  const filtered = omitBy<IPatientEditInput>(input, isNil);
  logger.log(`EDIT patient ${input.patientId} by ${userId}`, 2);
  return Patient.edit(filtered as any, input.patientId, txn);
}

export interface IPatientCoreIdentityVerifyOptions {
  input: IPatientCoreIdentityVerifyInput;
}

export async function patientCoreIdentityVerify(
  source: any,
  { input }: IPatientCoreIdentityVerifyOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['patientCoreIdentityVerify']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

  logger.log(`VERIFY patient ${input.patientId} by ${userId}`, 2);
  return Patient.coreIdentityVerify(input.patientId, userId!, txn);
}

export interface IEditPatientRequiredFields {
  patientId: string;
}

export async function resolvePatientNeedToKnow(
  root: any,
  { patientId }: IQuery,
  { permissions, userId, txn }: IContext,
): Promise<IPatientNeedToKnow> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  const patient = await Patient.get(patientId, txn);

  return { text: patient.scratchPad };
}

export interface IPatientNeedToKnowEditOptions {
  input: {
    patientId: string;
    text: string;
  };
}

export async function patientNeedToKnowEdit(
  root: any,
  { input }: IPatientNeedToKnowEditOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientNeedToKnow']> {
  const { patientId, text } = input;
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

  const patient = await Patient.edit({ scratchPad: text }, patientId, txn);

  return { text: patient.scratchPad };
}

export async function resolvePatientSearch(
  root: any,
  { query, pageNumber, pageSize }: IPatientSearchOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientSearch']> {
  let patients: IPaginatedResults<IPatientTableRow>;

  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

  patients = await Patient.search(query, { pageNumber, pageSize }, userId!, txn);

  const patientEdges = patients.results.map(
    (patient, i) => formatRelayEdge(patient, patient.id) as IPatientTableRowNode,
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

interface IPatientFilterInput extends IPaginationOptions {
  filters: IPatientFilterOptions;
  showAllPatients: boolean;
}

export async function resolvePatientPanel(
  root: any,
  { pageNumber, pageSize, filters, showAllPatients }: IPatientFilterInput,
  { permissions, userId, txn }: IContext,
): Promise<IPatientTableRowEdges> {
  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);
  const allowAllPatients = getBusinessToggles(permissions).canShowAllMembersInPatientPanel;
  const verifiedShowAllPatients = allowAllPatients && showAllPatients;

  const patients = await Patient.filter(
    userId!,
    { pageNumber, pageSize },
    filters,
    verifiedShowAllPatients,
    txn,
  );

  const patientEdges = patients.results.map(
    (patient, i) => formatRelayEdge(patient, patient.id) as IPatientTableRowNode,
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
  { permissions, userId, txn }: IContext,
  patientEndpoint: (
    pageOptions: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ) => Promise<IPaginatedResults<Patient>>,
): Promise<IPatientForDashboardEdges> {
  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

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
): Promise<IRootQueryType['patientsNewToCareTeam']> {
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
): Promise<IRootQueryType['patientsWithPendingSuggestions']> {
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
): Promise<IRootQueryType['patientsWithMissingInfo']> {
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
): Promise<IRootQueryType['patientsWithNoRecentEngagement']> {
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
): Promise<IRootQueryType['patientsWithOutOfDateMAP']> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithOutOfDateMAP,
  );
}

export async function resolvePatientsWithOpenCBOReferrals(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithOpenCBOReferrals,
  );
}

export async function resolvePatientsWithAssignedState(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithAssignedState,
  );
}

export async function resolvePatientsWithIntakeInProgress(
  root: any,
  pageOptions: IPaginationOptions,
  context: IContext,
): Promise<IPatientForDashboardEdges> {
  return resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithIntakeInProgress,
  );
}

export async function resolvePatientsForComputedList(
  root: any,
  { answerId, pageNumber, pageSize }: IPatientComputedListOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientsForComputedList']> {
  await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

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
