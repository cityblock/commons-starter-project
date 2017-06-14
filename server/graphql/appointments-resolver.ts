import * as moment from 'moment';
import {
  IAppointment,
  IAppointmentAddNoteInput,
  IAppointmentAddNoteResult,
  IAppointmentEndInput,
  IAppointmentEndResult,
  IAppointmentStartInput,
} from 'schema';
import { formatAppointment, getAppointmentId } from '../apis/athena/formatters';
import { IBookAppointmentResponse } from '../apis/athena/types';
import Clinic from '../models/clinic';
import Patient from '../models/patient';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

interface IAppointmentStartArgs {
  input: IAppointmentStartInput;
}

interface IAppointmentEndArgs {
  input: IAppointmentEndInput;
}

interface IAppointmentAddNoteArgs {
  input: IAppointmentAddNoteInput;
}

export async function appointmentStart(
  root: any,
  { input }: IAppointmentStartArgs,
  { userRole, athenaApi, userId }: IContext,
): Promise<IAppointment> {
  if (!userId) {
    throw new Error(`User must be logged in to start an appointment.`);
  }

  const user = await User.get(userId);

  const { patientId, appointmentTypeId } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'appointment', patientId, userId);

  const patient = await Patient.get(patientId);
  const clinic = await Clinic.get(patient.homeClinicId);

  const now = moment();
  const appointmentDate = now.format('MM/DD/YYYY');
  const appointmentTime = now.format('HH:mm');

  // create appointment slot
  const openAppointmentResponse = await athenaApi.appointmentsGetOpen(
    clinic.departmentId,
    appointmentTypeId || 2, // TODO: update this default
    1, // TODO: use user.athenaProviderId and blow up if there is no providerId for a user
    appointmentTime,
    appointmentDate,
  );

  const appointmentId = getAppointmentId(openAppointmentResponse);

  // book appointment for patient
  const bookAppointmentResponse = await athenaApi.appointmentBook(
    appointmentId,
    patient.athenaPatientId,
    appointmentTypeId || 2, // TODO: update this default
  );

  // checkin patient for appointment
  await athenaApi.appointmentCheckin(appointmentId);

  return formatAppointment(
    (bookAppointmentResponse as IBookAppointmentResponse[])[0],
    patient,
    user,
  );
}

export async function appointmentEnd(
  root: any,
  { input }: IAppointmentEndArgs,
  context: IContext,
): Promise<IAppointmentEndResult> {
  const { userRole, athenaApi, userId } = context;
  const { patientId, appointmentId, appointmentNote } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'appointment', patientId, userId);

  if (appointmentNote) {
    await appointmentAddNote(root, { input: input as IAppointmentAddNoteInput }, context);
  }

  const checkoutAppointmentResponse = await athenaApi.appointmentCheckout(appointmentId);

  return {
    success: !!checkoutAppointmentResponse.success,
  };
}

export async function appointmentAddNote(
  root: any,
  { input }: IAppointmentAddNoteArgs,
  { userRole, athenaApi, userId }: IContext,
): Promise<IAppointmentAddNoteResult> {
  const { patientId, appointmentId, appointmentNote } = input;
  await accessControls.isAllowedForUser(userRole, 'edit', 'appointment', patientId, userId);

  const result = await athenaApi.appointmentAddNote(appointmentId, appointmentNote);

  return {
    success: !!result.success,
    appointmentNote,
  };
}
