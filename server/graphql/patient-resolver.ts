import { isNil, omitBy } from 'lodash';
import { Transaction } from 'objection';
import {
  IPatientEditInput,
  IPatientFilterOptions,
  IPatientForDashboardEdges,
  IPatientScratchPad,
  IPatientTableRow,
  IPatientTableRowEdges,
  IPatientTableRowNode,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Patient from '../models/patient';
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
): Promise<IRootQueryType['patient']> {
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
): Promise<IRootMutationType['patientEdit']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);

  const filtered = omitBy<IPatientEditInput>(input, isNil);
  logger.log(`EDIT patient ${input.patientId} by ${userId}`, 2);
  return Patient.edit(filtered as any, input.patientId, txn);
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
): Promise<IRootQueryType['patientScratchPad']> {
  const { patientId, text } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', patientId, userId);

  const patient = await Patient.edit({ scratchPad: text }, patientId, txn);

  return { text: patient.scratchPad };
}

export async function resolvePatientSearch(
  root: any,
  { query, pageNumber, pageSize }: IPatientSearchOptions,
  { userRole, userId, txn }: IContext,
): Promise<IRootQueryType['patientSearch']> {
  let patients: IPaginatedResults<IPatientTableRow>;

  await accessControls.isAllowedForUser(userRole, 'view', 'patient');
  checkUserLoggedIn(userId);

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
}

export async function resolvePatientPanel(
  root: any,
  { pageNumber, pageSize, filters }: IPatientFilterInput,
  { userRole, userId, txn }: IContext,
): Promise<IPatientTableRowEdges> {
  await accessControls.isAllowedForUser(userRole, 'view', 'user', userId);
  checkUserLoggedIn(userId);

  const patients = await Patient.filter(userId!, { pageNumber, pageSize }, filters, txn);

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

export async function resolvePatientsForComputedList(
  root: any,
  { answerId, pageNumber, pageSize }: IPatientComputedListOptions,
  { userRole, userId, txn }: IContext,
): Promise<IRootQueryType['patientsForComputedList']> {
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
