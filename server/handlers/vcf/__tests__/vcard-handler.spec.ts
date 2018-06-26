import httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import { PhoneTypeOptions, UserRole } from 'schema';
import vCard from 'vcards-js';
import { signJwt } from '../../../graphql/shared/utils';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientInfo from '../../../models/patient-info';
import PatientPhone from '../../../models/patient-phone';
import Phone from '../../../models/phone';
import User from '../../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../../spec-helpers';
import {
  contactsVcfHandler,
  createvCardForCityblock,
  createvCardForPatient,
  formatvCardNameForPatient,
  isDuplicateName,
  validateJwtForVcf,
} from '../vcard-handler';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZ2VuZXJhdGVQREZKd3QiLCJpYXQiOjE1MTczMzcwNDUsImV4cCI6MTUxNzMzNzM0NX0.4OG2ho0S5Wj074KpcEP4Qpdqdj2jZ8Kh4rjBtH2kigU';

interface ISetup {
  clinic: Clinic;
  user: User;
  patient: Patient;
}

const setup = async (txn: Transaction): Promise<ISetup> => {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'Pharmacist' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { clinic, user, patient };
};

const getAuthToken = (userId?: string): string => {
  const jwtData = {
    createdAt: new Date().toISOString(),
    userId: userId || 'jonSnow',
  };

  return signJwt(jwtData, '10m');
};

describe('vCard Handler', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('validateJwtForVcf', () => {
    it('returns false if no token provided', async () => {
      const result = await validateJwtForVcf(null);
      expect(result).toBeFalsy();
    });

    it('returns false if invalid token provided', async () => {
      const result = await validateJwtForVcf(EXPIRED_TOKEN);
      expect(result).toBeFalsy();
    });

    it('returns true if valid token provided', async () => {
      const result = await validateJwtForVcf(getAuthToken());
      expect(result).toBeTruthy();
    });
  });

  describe('contactsVcfHandler', () => {
    it('returns vCards for a given user', async () => {
      const { clinic, user } = await setup(txn);

      const patient1 = await createPatient(
        {
          cityblockId: 678,
          homeClinicId: clinic.id,
          userId: user.id,
          lastName: 'Stark',
          firstName: 'Arya',
        },
        txn,
      );
      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user.id,
          lastName: 'Stark',
          firstName: 'Arya',
          middleName: 'Needle',
        },
        txn,
      );
      const patient3 = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, userId: user.id, lastName: 'Targaryen' },
        txn,
      );
      const patient4 = await createPatient(
        { cityblockId: 456, homeClinicId: clinic.id, lastName: 'Lannister' },
        txn,
      );
      const patient5 = await createPatient(
        {
          cityblockId: 567,
          homeClinicId: clinic.id,
          userId: user.id,
          lastName: 'Stark',
          firstName: 'Sansa',
        },
        txn,
      );
      await createPatient(
        { cityblockId: 789, homeClinicId: clinic.id, userId: user.id, lastName: 'Baratheon' },
        txn,
      );

      // create phones for patient 1
      const phone = await Phone.create(
        createMockPhone('123-456-1111', 'mobile' as PhoneTypeOptions),
        txn,
      );
      const phone2 = await Phone.create(
        createMockPhone('123-456-2222', 'home' as PhoneTypeOptions),
        txn,
      );
      const phone3 = await Phone.create(
        createMockPhone('123-456-3333', 'other' as PhoneTypeOptions),
        txn,
      );

      await PatientPhone.create({ phoneId: phone.id, patientId: patient1.id }, txn);
      await PatientPhone.create({ phoneId: phone2.id, patientId: patient1.id }, txn);
      await PatientPhone.create({ phoneId: phone3.id, patientId: patient1.id }, txn);

      await PatientPhone.delete({ phoneId: phone3.id, patientId: patient1.id }, txn);

      // create phones for patient 2
      const phone4 = await Phone.create(
        createMockPhone('123-456-4444', 'mobile' as PhoneTypeOptions),
        txn,
      );
      await PatientPhone.create({ phoneId: phone4.id, patientId: patient2.id }, txn);

      // create phone for patient 3
      const phone8 = await Phone.create(
        createMockPhone('123-456-8888', 'mobile' as PhoneTypeOptions),
        txn,
      );
      await PatientPhone.create({ phoneId: phone8.id, patientId: patient3.id }, txn);

      // create phone for patient 4
      const phone5 = await Phone.create(
        createMockPhone('123-456-5555', 'mobile' as PhoneTypeOptions),
        txn,
      );
      await PatientPhone.create({ phoneId: phone5.id, patientId: patient4.id }, txn);

      // create phone for patient 5
      const phone6 = await Phone.create(
        createMockPhone('123-456-6666', 'mobile' as PhoneTypeOptions),
        txn,
      );
      const phone7 = await Phone.create(
        createMockPhone('123-456-7777', 'mobile' as PhoneTypeOptions),
        txn,
      );

      await PatientPhone.create({ phoneId: phone6.id, patientId: patient5.id }, txn);
      await PatientPhone.create({ phoneId: phone7.id, patientId: patient5.id }, txn);

      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken(user.id) };

      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.status = jest.fn();
      res.set = jest.fn();
      const mockSend = jest.fn();
      res.send = mockSend;
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await contactsVcfHandler(req, res);

      const args = mockSend.mock.calls;

      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:Arya N Stark\r\nN;CHARSET=UTF-8:Stark;Arya;N;;\r\nUID;CHARSET=UTF-8:234\r\nTEL;TYPE=CELL:+11234564444\r\nNOTE;CHARSET=UTF-8:CBH-234',
      );
      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:Arya Stark\r\nN;CHARSET=UTF-8:Stark;Arya;;;\r\nUID;CHARSET=UTF-8:678\r\nTEL;TYPE=CELL:+11234561111\r\nTEL;TYPE=HOME,VOICE:+11234562222\r\nNOTE;CHARSET=UTF-8:CBH-678',
      );
      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:Sansa Stark\r\nN;CHARSET=UTF-8:Stark;Sansa;;;\r\nUID;CHARSET=UTF-8:567\r\nTEL;TYPE=CELL:+11234566666\r\nTEL;TYPE=CELL:+11234567777\r\nNOTE;CHARSET=UTF-8:CBH-567',
      );
      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:dan Targaryen\r\nN;CHARSET=UTF-8:Targaryen;dan;;;\r\nUID;CHARSET=UTF-8:345\r\nTEL;TYPE=CELL:+11234568888\r\nNOTE;CHARSET=UTF-8:CBH-345',
      );
      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:Cityblock Admin\r\nN;CHARSET=UTF-8:Admin;Cityblock;;;\r\nTEL;TYPE=HOME,VOICE:+17273415787',
      );
      expect(args[0][0]).toMatch(
        'BEGIN:VCARD\r\nVERSION:3.0\r\nFN;CHARSET=UTF-8:Cityblock Voicemail\r\nN;CHARSET=UTF-8:Voicemail;Cityblock;;;\r\nTEL;TYPE=HOME,VOICE:+16469417791',
      );

      expect(res.status).not.toBeCalled();
    });

    it('returns a 409 conflict if patients in care team with duplicate names', async () => {
      const { clinic, user } = await setup(txn);

      await createPatient(
        {
          cityblockId: 678,
          homeClinicId: clinic.id,
          userId: user.id,
          lastName: 'Stark',
          firstName: 'Arya',
        },
        txn,
      );
      await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user.id,
          lastName: 'Stark',
          firstName: 'Arya',
        },
        txn,
      );

      const req = httpMocks.createRequest();
      req.query = { token: getAuthToken(user.id) };

      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.status = jest.fn();
      res.set = jest.fn();
      const mockSend = jest.fn();
      res.send = mockSend;
      (res.status as any).mockReturnValueOnce({ send: mockSend });

      await contactsVcfHandler(req, res);

      expect(res.status).toBeCalledWith(409);
      expect(mockSend).toBeCalledWith(
        'You have two patients with the name Arya Stark on your care team. Please edit their preferred name or contact us for help.',
      );
      expect(res.set).not.toBeCalled();
    });

    it('returns a 401 unauthorized if no token provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await contactsVcfHandler(req, res);

      expect(res.status).toBeCalledWith(401);
    });

    it('returns a 401 unauthorized if expired token provided', async () => {
      const req = httpMocks.createRequest();
      req.query = { token: EXPIRED_TOKEN };
      const res = httpMocks.createResponse();
      res.status = jest.fn();
      (res.status as any).mockReturnValueOnce({ send: jest.fn() });

      await contactsVcfHandler(req, res);

      expect(res.status).toBeCalledWith(401);
    });
  });

  describe('createvCardForPatient', () => {
    it('does not create a vCard if the patient does not have any phone numbers', async () => {
      const { patient } = await setup(txn);

      expect(createvCardForPatient(patient)).toBeNull();
    });

    it('creates a vCard for a patient', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          firstName: 'Arya',
          lastName: 'Stark',
          userId: user.id,
        },
        txn,
      );

      const phone = await Phone.create(
        createMockPhone('123-456-1111', 'mobile' as PhoneTypeOptions),
        txn,
      );
      const phone2 = await Phone.create(
        createMockPhone('123-456-2222', 'home' as PhoneTypeOptions),
        txn,
      );
      const phone3 = await Phone.create(
        createMockPhone('123-456-3333', 'other' as PhoneTypeOptions),
        txn,
      );
      const phone4 = await Phone.create(
        createMockPhone('123-456-4444', 'work' as PhoneTypeOptions),
        txn,
      );
      const phone5 = await Phone.create(
        createMockPhone('123-456-5555', 'other' as PhoneTypeOptions),
        txn,
      );

      await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);
      await PatientPhone.create({ phoneId: phone2.id, patientId: patient.id }, txn);
      await PatientPhone.create({ phoneId: phone3.id, patientId: patient.id }, txn);
      await PatientPhone.create({ phoneId: phone4.id, patientId: patient.id }, txn);
      await PatientPhone.create({ phoneId: phone5.id, patientId: patient.id }, txn);

      const patients = await Patient.getPatientsWithPhonesForUser(user.id, txn);

      const card = createvCardForPatient(patients[0]);

      expect(card!.firstName).toBe('Arya');
      expect(card!.lastName).toBe('Stark');
      expect(card!.middleName).toBeFalsy();
      expect(card!.nickname).toBeFalsy();
      expect(card!.uid).toBe(234);
      expect(card!.note).toBe('CBH-234');
      expect(card!.homePhone).toEqual(['+11234562222']);
      expect(card!.cellPhone).toEqual(['+11234561111']);
      expect(card!.otherPhone).toEqual(['+11234563333', '+11234565555']);
      expect(card!.workPhone).toEqual(['+11234564444']);
    });
  });

  describe('createvCardForCityblock', () => {
    it('creates a vCard for Cityblock contact', () => {
      const card = createvCardForCityblock('Admin');

      expect(card.firstName).toBe('Cityblock');
      expect(card.lastName).toBe('Admin');
      expect(card.homePhone).toBe('+17273415787');
    });
  });

  describe('formatvCardNameForPatient', () => {
    it('adds cityblock id, first name, and last name', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, firstName: 'Khal', lastName: 'Drogo' },
        txn,
      );

      const card = vCard();

      formatvCardNameForPatient(card, patient);

      expect(card.uid).toBe(patient.cityblockId);
      expect(card.firstName).toBe('Khal');
      expect(card.lastName).toBe('Drogo');
      expect(card.middleName).toBeFalsy();
      expect(card.nickname).toBeFalsy();
      expect(card.note).toBe('CBH-234');
    });

    it('adds middle initial if available', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          firstName: 'Khal',
          lastName: 'Drogo',
          middleName: 'Dothraki',
        },
        txn,
      );

      const card = vCard();

      formatvCardNameForPatient(card, patient);

      expect(card.uid).toBe(patient.cityblockId);
      expect(card.firstName).toBe('Khal');
      expect(card.lastName).toBe('Drogo');
      expect(card.middleName).toBe('D');
      expect(card.nickname).toBeFalsy();
      expect(card.note).toBe('CBH-234');
    });

    it('adds preferred name if available', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          firstName: 'Khal',
          lastName: 'Drogo',
          middleName: 'Dothraki',
        },
        txn,
      );

      await PatientInfo.edit(
        { preferredName: 'My Sun and Stars', updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );

      const fetchedPatient = await Patient.get(patient.id, txn);

      const card = vCard();

      formatvCardNameForPatient(card, fetchedPatient);

      expect(card.uid).toBe(patient.cityblockId);
      expect(card.firstName).toBe('Khal (My Sun and Stars)');
      expect(card.lastName).toBe('Drogo');
      expect(card.middleName).toBe('D');
      expect(card.note).toBe('CBH-234');
    });
  });

  describe('isDuplicateName', () => {
    it('returns false if different last names', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, lastName: 'Targaryen' },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark' },
        txn,
      );

      expect(isDuplicateName(patient, previousPatient)).toBeFalsy();
    });

    it('returns false if same last name but different first name', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Sansa' },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Arya' },
        txn,
      );

      expect(isDuplicateName(patient, previousPatient)).toBeFalsy();
    });

    it('returns false if same first name but different last names', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, lastName: 'FacelessMan', firstName: 'Arya' },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Arya' },
        txn,
      );

      expect(isDuplicateName(patient, previousPatient)).toBeFalsy();
    });

    it('returns false if same first and last name but different middle names', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          lastName: 'Stark',
          firstName: 'Arya',
          middleName: 'Needle',
        },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Arya' },
        txn,
      );

      expect(isDuplicateName(patient, previousPatient)).toBeFalsy();
    });

    it('returns true is same first and last names and same middle initials', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          lastName: 'Stark',
          firstName: 'Arya',
          middleName: 'Needle',
        },
        txn,
      );
      const previousPatient = await createPatient(
        {
          cityblockId: 345,
          homeClinicId: clinic.id,
          lastName: 'Stark',
          firstName: 'Arya',
          middleName: 'Nymeria',
        },
        txn,
      );

      expect(isDuplicateName(patient, previousPatient)).toBeTruthy();
    });

    it('returns false if same first and last name but different prefered names', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Sansa' },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Sansa' },
        txn,
      );

      await PatientInfo.edit(
        { preferredName: 'Lady of WinterFell', updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );

      const fetchedPatient = await Patient.get(patient.id, txn);

      expect(isDuplicateName(fetchedPatient, previousPatient)).toBeFalsy();
    });

    it('returns true if same first and last name', async () => {
      const { clinic, user } = await setup(txn);
      const patient = await createPatient(
        { cityblockId: 234, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Sansa' },
        txn,
      );
      const previousPatient = await createPatient(
        { cityblockId: 345, homeClinicId: clinic.id, lastName: 'Stark', firstName: 'Sansa' },
        txn,
      );

      await PatientInfo.edit(
        { preferredName: 'Lady of WinterFell', updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );
      await PatientInfo.edit(
        { preferredName: 'Lady of WinterFell', updatedById: user.id },
        previousPatient.patientInfo.id,
        txn,
      );

      const fetchedPatient = await Patient.get(patient.id, txn);
      const fetchedPreviousPatient = await Patient.get(previousPatient.id, txn);

      expect(isDuplicateName(fetchedPatient, fetchedPreviousPatient)).toBeTruthy();
    });
  });
});
