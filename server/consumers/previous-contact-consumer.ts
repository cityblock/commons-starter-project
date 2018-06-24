import { transaction, Transaction } from 'objection';
import { formatAbbreviatedName } from '../helpers/format-helpers';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import PatientPhone from '../models/patient-phone';
import { notifyUserOfContactEdit } from './contact-update-consumer';

interface IPreviousContactData {
  userId: string;
  contactNumber: string;
}

export async function processPreviousContactCheck(
  data: IPreviousContactData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const patientId = await PatientPhone.getPatientIdForPhoneNumber(data.contactNumber, txn, true);

    // do nothing if phone number not associated with patient
    if (!patientId) {
      return;
    }

    const careTeam = await CareTeam.getForPatient(patientId, txn);
    const user = careTeam.find(member => member.id === data.userId);

    // do nothing if user not on patient's care team
    if (!user) {
      return;
    }

    const patient = await Patient.get(patientId, txn);

    const noticeCopy = getNoticeCopy(patient);

    await notifyUserOfContactEdit(user, noticeCopy);
  });
}

export function getNoticeCopy(patient: Patient): string {
  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    patient.patientInfo.preferredName,
  );

  return `It looks like you're trying to reach a number no long associated with ${patientName} Please visit Commons to get their updated contact info.`;
}
