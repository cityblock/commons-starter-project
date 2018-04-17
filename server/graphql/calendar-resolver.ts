import { intersection } from 'lodash';
import { ICalendarCreateEventForPatientInput, IRootMutationType } from 'schema';
import {
  createGoogleCalendarEventUrl,
  createGoogleCalendarForPatientWithTeam,
} from '../helpers/google-calendar-helpers';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import PatientInfo from '../models/patient-info';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface ICalendarCreateEventForPatientOptions {
  input: ICalendarCreateEventForPatientInput;
}

export async function calendarCreateEventForPatient(
  source: any,
  { input }: ICalendarCreateEventForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['calendarCreateEventForPatient']> {
  const { patientId, startDatetime, endDatetime, inviteeEmails, location, title, reason } = input;
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

  logger.log(`CREATE calendar for patient ${patientId} by ${userId}`, 2);

  const patient = await Patient.get(patientId, txn);
  const patientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
  let calendarId = patientInfo.googleCalendarId;
  const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);
  const careTeamEmails = careTeamRecords.map(record => record.user.email);

  // disallow inviting emails of people not on a users care team
  const filteredInvitees = intersection(inviteeEmails, careTeamEmails);

  if (!patientInfo.googleCalendarId) {
    try {
      const response = await createGoogleCalendarForPatientWithTeam(
        `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        careTeamEmails,
      );

      calendarId = response.data.id;
      await PatientInfo.edit(
        { updatedById: userId!, googleCalendarId: calendarId },
        patientInfo.id,
        txn,
      );
    } catch (err) {
      console.warn(err);
      throw new Error(`There was an error creating a calendar for patient: ${patientId}`);
    }
  }

  const eventCreateUrl = createGoogleCalendarEventUrl({
    calendarId,
    startDatetime,
    endDatetime,
    inviteeEmails: filteredInvitees,
    location,
    title,
    reason,
  });

  return { eventCreateUrl };
}
