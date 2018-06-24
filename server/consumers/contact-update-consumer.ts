import { transaction, Transaction } from 'objection';
import config from '../config';
import { formatAbbreviatedName } from '../helpers/format-helpers';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import User from '../models/user';
import TwilioClient from '../twilio-client';

type PatientContactEdit =
  | 'addPhoneNumber'
  | 'deletePhoneNumber'
  | 'addCareTeamMember'
  | 'editPreferredName';

interface IProcessPatientContactEditData {
  type: PatientContactEdit;
  patientId?: string; // include this if single patient
  patientIds?: string[]; // include this is multiple patients (bulk assign)
  userId?: string; // notify a specific user vs entire care team
  prevPreferredName?: string; // so user knows which contact to delete if preferred name change
}

type NoticeCopyVerbs = { [K in PatientContactEdit]: string };

const noticeCopyVerbs: Partial<NoticeCopyVerbs> = {
  addPhoneNumber: 'added',
  deletePhoneNumber: 'deleted',
};

export async function processPatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  if (data.patientId) {
    await processSinglePatientContactEdit(data, existingTxn);
  } else if (data.patientIds && data.userId) {
    await processBulkPatientContactEdit(data, existingTxn);
  }
}

async function processSinglePatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const patient = await Patient.get(data.patientId!, txn);
    const noticeCopy = getNoticeCopy(patient, data.type, data.prevPreferredName);

    // if no user specified, update care team
    if (!data.userId) {
      const careTeam = await CareTeam.getForPatient(data.patientId!, txn);
      careTeam.forEach(async user => {
        await notifyUserOfContactEdit(user, noticeCopy);
      });
      // if new patient has at least one phone, notify user of new contact
    } else if (patient.patientInfo.primaryPhone) {
      const user = await User.get(data.userId, txn);
      await notifyUserOfContactEdit(user, noticeCopy);
    }
  });
}

async function processBulkPatientContactEdit(
  data: IProcessPatientContactEditData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    for (const patientId of data.patientIds!) {
      const patient = await Patient.get(patientId, txn);

      if (patient.patientInfo.primaryPhone) {
        const user = await User.get(data.userId!, txn);
        const noticeCopy = getNoticeCopy(patient, data.type);

        await notifyUserOfContactEdit(user, noticeCopy);
        // break loop, since don't want to notify user multiple times
        break;
      }
    }
  });
}

export async function notifyUserOfContactEdit(user: User, noticeCopy: string): Promise<void> {
  // if in production or test actually throw error for users without phones
  if (!user.phone && (config.NODE_ENV === 'production' || config.NODE_ENV === 'test')) {
    throw new Error(`User ${user.id} does not have phone number registered in Commons.`);
  } else if (!user.phone) {
    return;
  }

  const twilioClient = TwilioClient.get();

  await twilioClient.messages.create({
    from: config.CITYBLOCK_ADMIN,
    to: user.phone,
    body: noticeCopy,
  });
}

export function getNoticeCopy(
  patient: Patient,
  type: PatientContactEdit,
  prevPreferredName?: string | null,
): string {
  const preferredName =
    prevPreferredName === undefined ? patient.patientInfo.preferredName : prevPreferredName;

  const patientName = formatAbbreviatedName(patient.firstName, patient.lastName, preferredName);

  // if add to care team message, short enough for 1 SMS
  if (type === 'addCareTeamMember') {
    return `A member ${patientName} has been added to your care team. Please visit Commons to get their contact info.`;
  }

  if (type === 'editPreferredName') {
    return `The preferred name of ${patientName} has been updated in Commons. Please visit Commons to see the update.`;
  }

  let copy = type === 'addPhoneNumber' ? 'A new contact for ' : 'An existing contact for ';

  copy += `${patientName} has been `;

  const verb = noticeCopyVerbs[type];

  copy += `${verb}. Please visit Commons to get their updated contact info.`;

  return copy;
}
