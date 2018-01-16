import { isNil, omitBy } from 'lodash';
import { transaction, Transaction } from 'objection';
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
import CareTeam from '../models/care-team';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  patientId: string;
}

export interface IPatientSearchOptions extends IPaginationOptions {
  query: string;
}

export async function resolvePatient(
  root: any,
  { patientId }: IQuery,
  { userRole, userId, logger }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);
  logger.log(`GET patient ${patientId} by ${userId}`, 2);
  return await Patient.get(patientId);
}

export interface IPatientEditOptions {
  input: IPatientEditInput;
}

export async function patientEdit(
  source: any,
  { input }: IPatientEditOptions,
  { userRole, userId, logger }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', input.patientId, userId);

  const filtered = omitBy<IPatientEditInput>(input, isNil);
  logger.log(`EDIT patient ${input.patientId} by ${userId}`, 2);
  return await Patient.edit(filtered as any, input.patientId);
}

export interface IPatientSetupOptions {
  input: IPatientSetupInput;
}

export async function patientSetup(
  source: any,
  { input }: IPatientSetupOptions,
  { redoxApi, userRole, userId, logger }: IContext,
): Promise<IPatient> {
  await accessControls.isAllowedForUser(userRole, 'create', 'patient');
  checkUserLoggedIn(userId);

  const result = await transaction(Patient.knex(), async txn => {
    const patient = await Patient.setup(input, userId!, txn);
    const department = await Clinic.get(input.homeClinicId, txn);
    const redoxPatient = await redoxApi.patientCreate({
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
    });
    const athenaPatientId = getAthenaPatientIdFromCreate(redoxPatient);
    if (!athenaPatientId) {
      throw new Error('Athena patient was not correctly created');
    }
    return await Patient.addAthenaPatientId(athenaPatientId, patient.id, txn);
  });
  // Need to wait until the transaction is complete to add relations like Care Team
  await CareTeam.create({ userId: userId!, patientId: result.id });
  logger.log(`SETUP patient ${result.id} by ${userId}`, 2);
  return result;
}

export interface IEditPatientRequiredFields {
  patientId: string;
}

export async function resolvePatientScratchPad(
  root: any,
  { patientId }: IQuery,
  { userRole, userId }: IContext,
): Promise<IPatientScratchPad> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patient', patientId, userId);

  const patient = await Patient.get(patientId);

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
  { userRole, userId }: IContext,
): Promise<IPatientScratchPad> {
  const { patientId, text } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'patient', patientId, userId);

  const patient = await Patient.edit({ scratchPad: text }, patientId);

  return { text: patient.scratchPad };
}

export async function resolvePatientSearch(
  root: any,
  { query, pageNumber, pageSize }: IPatientSearchOptions,
  { userRole, userId }: IContext,
): Promise<IPatientSearchResultEdges> {
  let patients: IPaginatedResults<IPatientSearchResult>;
  await accessControls.isAllowedForUser(userRole, 'view', 'patient');
  checkUserLoggedIn(userId);

  patients = await Patient.search(query, { pageNumber, pageSize }, userId!);

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
    txn?: Transaction,
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
  return await resolvePatientDashboardBuilder(
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
  return await resolvePatientDashboardBuilder(
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
  return await resolvePatientDashboardBuilder(
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
  return await resolvePatientDashboardBuilder(
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
  return await resolvePatientDashboardBuilder(
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
  return await resolvePatientDashboardBuilder(
    root,
    pageOptions,
    context,
    Patient.getPatientsWithOutOfDateMAP,
  );
}
/* tslint:enable check-is-allowed */
