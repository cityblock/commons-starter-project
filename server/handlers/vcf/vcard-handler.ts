import express from 'express';
import { transaction } from 'objection';
import vCard from 'vcards-js';
import config from '../../config';
import { decodeJwt, IJWTForVCFData } from '../../graphql/shared/utils';
import Patient from '../../models/patient';

type CityblockContact = 'Admin' | 'Voicemail';

interface IPhonesForCard {
  home: string[];
  mobile: string[];
  other: string[];
  work: string[];
}

interface ICard {
  uid: number;
  firstName: string;
  middleName?: string;
  nickname?: string;
  lastName: string;
  note: string;
  getFormattedString: () => string;
  homePhone: string[];
  cellPhone: string[];
  otherPhone: string[];
  workPhone: string[];
}

export const validateJwtForVcf = async (token: string | null): Promise<IJWTForVCFData> => {
  let decoded = null;

  if (token) {
    try {
      decoded = await decodeJwt(token);
    } catch (err) {
      console.warn(err);
    }
  }

  return decoded as IJWTForVCFData;
};

export const contactsVcfHandler = async (req: express.Request, res: express.Response) => {
  const { token } = req.query;
  const decoded = await validateJwtForVcf(token || null);

  if (!decoded || !decoded.userId) {
    return res.status(401).send('Invalid token');
  }

  let result = '';
  let error = '';

  const adminContact = createvCardForCityblock('Admin');
  const voicemailContact = createvCardForCityblock('Voicemail');

  result += adminContact.getFormattedString();
  result += voicemailContact.getFormattedString();

  await transaction(res.locals.existingTxn || Patient.knex(), async txn => {
    const patients = await Patient.getPatientsWithPhonesForUser(decoded.userId, txn);

    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const previousPatient = i > 0 ? patients[i - 1] : null;

      // if duplicate name, throw an error
      if (isDuplicateName(patient, previousPatient)) {
        error = `You have two patients with the name ${patient.firstName} ${
          patient.lastName
        } on your care team. Please edit their preferred name or contact us for help.`;
        break;
      }

      const card = createvCardForPatient(patient);

      if (card) {
        result += card.getFormattedString();
      }
    }
    /* tslint:enable:prefer-for-of */
  });

  if (error) {
    res.status(409).send(error);
  } else {
    res.set('Content-Type', 'text/vcard; name="contacts.vcf"');
    res.set('Content-Disposition', 'attachment; filename="contacts.vcf"');

    res.send(result);
  }
};

export const createvCardForPatient = (patient: Patient): ICard | null => {
  // do not send vCard if patient has no phones
  if (!patient.phones || !patient.phones.length) return null;

  const card = vCard();

  formatvCardNameForPatient(card, patient);

  const phones: IPhonesForCard = {
    home: [],
    mobile: [],
    other: [],
    work: [],
  };

  patient.phones.forEach(phone => {
    phones[phone.type].push(phone.phoneNumber);
  });

  card.homePhone = phones.home;
  card.cellPhone = phones.mobile;
  card.otherPhone = phones.other;
  card.workPhone = phones.work;

  return card;
};

export const formatvCardNameForPatient = (card: ICard, patient: Patient): void => {
  card.uid = patient.cityblockId;
  card.firstName = patient.firstName;
  card.lastName = patient.lastName;
  card.note = `CBH-${patient.cityblockId}`;

  // add middle initial if available
  if (patient.middleName) {
    card.middleName = patient.middleName[0];
  }
  // add preferred name if available
  if (patient.patientInfo.preferredName) {
    card.firstName = `${patient.firstName} (${patient.patientInfo.preferredName})`;
  }
};

export const createvCardForCityblock = (type: CityblockContact): ICard => {
  const card = vCard();

  card.firstName = 'Cityblock';
  card.lastName = type;

  card.homePhone = (config as any)[`CITYBLOCK_${type.toUpperCase()}`];

  return card;
};

export const isDuplicateName = (patient: Patient, previousPatient: Patient | null): boolean => {
  // if no previous patient, it cannot be a duplicate name
  if (!previousPatient) return false;
  // if one has middle name and another doesn't, not a duplicate
  if (!!patient.middleName === !previousPatient.middleName) {
    return false;
  }
  // if middle initials don't match, not a duplicate
  if (
    patient.middleName &&
    previousPatient.middleName &&
    patient.middleName[0] !== previousPatient.middleName[0]
  ) {
    return false;
  }

  // if preferred names do not match, not a duplicate
  if (patient.patientInfo.preferredName !== previousPatient.patientInfo.preferredName) {
    return false;
  }

  return (
    patient.lastName === previousPatient.lastName && patient.firstName === previousPatient.firstName
  );
};
