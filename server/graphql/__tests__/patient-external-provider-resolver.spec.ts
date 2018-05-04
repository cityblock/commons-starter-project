import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as getPatientExternalProviders from '../../../app/graphql/queries/get-patient-external-providers.graphql';
import * as patientExternalProviderCreate from '../../../app/graphql/queries/patient-external-provider-create-mutation.graphql';
import * as patientExternalProviderDelete from '../../../app/graphql/queries/patient-external-provider-delete-mutation.graphql';
import * as patientExternalProviderEdit from '../../../app/graphql/queries/patient-external-provider-edit-mutation.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Email from '../../models/email';
import Patient from '../../models/patient';
import PatientExternalProvider from '../../models/patient-external-provider';
import PatientExternalProviderEmail from '../../models/patient-external-provider-email';
import PatientExternalProviderPhone from '../../models/patient-external-provider-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import {
  createMockClinic,
  createMockEmail,
  createMockPatientExternalProvider,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'physician' as UserRole;
const permissions = 'green';

interface ISetup {
  patient: Patient;
  user: User;
}

interface ISetupContact {
  patientExternalProvider: PatientExternalProvider;
  phone: Phone;
  email: Email;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { patient, user };
}

async function setupPatientExternalProvider(
  patientId: string,
  userId: string,
  txn: Transaction,
): Promise<ISetupContact> {
  const phone = await Phone.create(createMockPhone(), txn);
  const email = await Email.create(createMockEmail(userId), txn);

  const patientExternalProvider = await PatientExternalProvider.create(
    createMockPatientExternalProvider(patientId, userId, phone, { email }),
    txn,
  );

  await PatientExternalProviderPhone.create(
    { phoneId: phone.id, patientExternalProviderId: patientExternalProvider.id },
    txn,
  );
  await PatientExternalProviderEmail.create(
    { emailId: email.id, patientExternalProviderId: patientExternalProvider.id },
    txn,
  );

  return { patientExternalProvider, phone, email };
}

describe('patient info model', () => {
  const patientExternalProvidersQuery = print(getPatientExternalProviders);
  const patientExternalProviderCreateMutation = print(patientExternalProviderCreate);
  const patientExternalProviderDeleteMutation = print(patientExternalProviderDelete);
  const patientExternalProviderEditMutation = print(patientExternalProviderEdit);
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient external providers resolvers', async () => {
    it('gets all patient external providers for patient with id', async () => {
      const { user, patient } = await setup(txn);
      const { patientExternalProvider, phone, email } = await setupPatientExternalProvider(
        patient.id,
        user.id,
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalProvidersQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      const {
        lastName,
        firstName,
        agencyName,
        role,
        roleFreeText,
        description,
      } = patientExternalProvider;
      expect(cloneDeep(result.data!.patientExternalProviders)).toHaveLength(1);
      expect(cloneDeep(result.data!.patientExternalProviders[0])).toMatchObject({
        firstName,
        lastName,
        agencyName,
        roleFreeText,
        role,
        description,
        phone: {
          id: phone.id,
          phoneNumber: phone.phoneNumber,
        },
        email: {
          id: email.id,
          emailAddress: email.emailAddress,
        },
      });
      expect(log).toBeCalled();
    });
  });

  describe('create', async () => {
    it('should create a patient external provider with minimal info', async () => {
      const { patient, user } = await setup(txn);
      const phone = { phoneNumber: '+11112223333' };
      const providerFields = createMockPatientExternalProvider(patient.id, user.id, phone);

      const result = await graphql(
        schema,
        patientExternalProviderCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        providerFields,
      );

      expect(cloneDeep(result.data!.patientExternalProviderCreate)).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        agencyName: 'Hogwarts',
        roleFreeText: null,
        email: null,
        description: 'some provider description',
      });
      expect(log).toBeCalled();

      const patientExternalProviderPhone = await PatientExternalProviderPhone.getForPatientExternalProvider(
        result.data!.patientExternalProviderCreate.id,
        txn,
      );
      expect(patientExternalProviderPhone).not.toBeNull();
      expect(patientExternalProviderPhone.length).toBe(1);
    });

    it('should create a patient external provider with all external provider fields', async () => {
      const { patient, user } = await setup(txn);
      const phone = { phoneNumber: '+11112223333' };
      const email = { emailAddress: 'test@email.com' };
      const providerFields = createMockPatientExternalProvider(patient.id, user.id, phone, {
        email,
      });

      const result = await graphql(
        schema,
        patientExternalProviderCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        providerFields,
      );

      expect(cloneDeep(result.data!.patientExternalProviderCreate)).toMatchObject({
        phone,
        email,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        agencyName: 'Hogwarts',
        roleFreeText: null,
        description: 'some provider description',
      });
      expect(log).toBeCalled();

      const patientExternalProviderPhone = await PatientExternalProviderPhone.getForPatientExternalProvider(
        result.data!.patientExternalProviderCreate.id,
        txn,
      );
      expect(patientExternalProviderPhone).not.toBeNull();
      expect(patientExternalProviderPhone.length).toBe(1);

      const patientExternalProviderEmail = await PatientExternalProviderEmail.getForPatientExternalProvider(
        result.data!.patientExternalProviderCreate.id,
        txn,
      );
      expect(patientExternalProviderEmail).not.toBeNull();
      expect(patientExternalProviderEmail).toHaveLength(1);
    });

    it('should create a patient external provider but not empty email', async () => {
      const { patient, user } = await setup(txn);
      const phone = { phoneNumber: '+11112223333' };
      const email = { emailAddress: '' };
      const providerFields = createMockPatientExternalProvider(patient.id, user.id, phone, {
        email,
      });

      const result = await graphql(
        schema,
        patientExternalProviderCreateMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        providerFields,
      );

      expect(cloneDeep(result.data!.patientExternalProviderCreate)).toMatchObject({
        phone,
        email: null,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        agencyName: 'Hogwarts',
        roleFreeText: null,
        description: 'some provider description',
      });
      expect(log).toBeCalled();

      const patientExternalProviderPhone = await PatientExternalProviderPhone.getForPatientExternalProvider(
        result.data!.patientExternalProviderCreate.id,
        txn,
      );
      expect(patientExternalProviderPhone).not.toBeNull();
      expect(patientExternalProviderPhone.length).toBe(1);

      const patientExternalProviderEmail = await PatientExternalProviderEmail.getForPatientExternalProvider(
        result.data!.patientExternalProviderCreate.id,
        txn,
      );
      expect(patientExternalProviderEmail).not.toBeNull();
      expect(patientExternalProviderEmail).toHaveLength(0);
    });
  });

  describe('delete', async () => {
    it('should delete a patient external provider and all associated models', async () => {
      const { patient, user } = await setup(txn);
      const { patientExternalProvider } = await setupPatientExternalProvider(
        patient.id,
        user.id,
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalProviderDeleteMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        { patientExternalProviderId: patientExternalProvider.id },
      );

      expect(cloneDeep(result.data!.patientExternalProviderDelete).deletedAt).not.toBeFalsy();
      expect(log).toBeCalled();

      const emails = await PatientExternalProviderEmail.getForPatientExternalProvider(
        patientExternalProvider.id,
        txn,
      );
      expect(emails).toHaveLength(0);

      const phones = await PatientExternalProviderPhone.getForPatientExternalProvider(
        patientExternalProvider.id,
        txn,
      );
      expect(phones).toHaveLength(0);

      await expect(PatientExternalProvider.get(patientExternalProvider.id, txn)).rejects.toMatch(
        `No such patient external provider: ${patientExternalProvider.id}`,
      );
    });
  });

  describe('edit', async () => {
    it('should edit patient external provider and create email', async () => {
      const { patient, user } = await setup(txn);
      const phone = await Phone.create(createMockPhone(), txn);

      const patientExternalProvider = await PatientExternalProvider.create(
        createMockPatientExternalProvider(patient.id, user.id, phone),
        txn,
      );

      await PatientExternalProviderPhone.create(
        { phoneId: phone.id, patientExternalProviderId: patientExternalProvider.id },
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalProviderEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientExternalProviderId: patientExternalProvider.id,
          firstName: 'Luna',
          lastName: 'Lovegood',
          role: 'other',
          agencyName: 'Quibbler',
          roleFreeText: 'magical potion provider',
          phone: { phoneNumber: '000-111-2255' },
          email: { emailAddress: 'changed@email.com' },
        },
      );

      expect(cloneDeep(result.data!.patientExternalProviderEdit)).toMatchObject({
        patientId: patient.id,
        firstName: 'Luna',
        lastName: 'Lovegood',
        role: 'other',
        agencyName: 'Quibbler',
        roleFreeText: 'magical potion provider',
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: { emailAddress: 'changed@email.com' },
      });
      expect(log).toBeCalled();

      const patientExternalProviderEmail = await PatientExternalProviderEmail.getForPatientExternalProvider(
        result.data!.patientExternalProviderEdit.id,
        txn,
      );
      expect(patientExternalProviderEmail).not.toBeNull();
      expect(patientExternalProviderEmail).toHaveLength(1);
    });

    it('should edit patient external provider and update email', async () => {
      const { patient, user } = await setup(txn);
      const { patientExternalProvider, phone, email } = await setupPatientExternalProvider(
        patient.id,
        user.id,
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalProviderEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientExternalProviderId: patientExternalProvider.id,
          firstName: 'Luna',
          lastName: 'Lovegood',
          role: 'dermatology',
          agencyName: 'Quibbler',
          phone: { phoneNumber: '000-111-2255' },
          email: { emailAddress: 'changed@email.com' },
        },
      );

      expect(cloneDeep(result.data!.patientExternalProviderEdit)).toMatchObject({
        patientId: patient.id,
        firstName: 'Luna',
        lastName: 'Lovegood',
        role: 'dermatology',
        agencyName: 'Quibbler',
        roleFreeText: null,
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: { id: email.id, emailAddress: 'changed@email.com' },
      });
      expect(log).toBeCalled();

      const patientExternalProviderEmail = await PatientExternalProviderEmail.getForPatientExternalProvider(
        result.data!.patientExternalProviderEdit.id,
        txn,
      );
      expect(patientExternalProviderEmail).not.toBeNull();
      expect(patientExternalProviderEmail).toHaveLength(1);
    });

    it('should edit patient external provider and delete email', async () => {
      const { patient, user } = await setup(txn);
      const { patientExternalProvider, phone } = await setupPatientExternalProvider(
        patient.id,
        user.id,
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalProviderEditMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientExternalProviderId: patientExternalProvider.id,
          firstName: 'Luna',
          lastName: 'Lovegood',
          role: 'dermatology',
          agencyName: 'Quibbler',
          phone: { phoneNumber: '000-111-2255' },
          email: { emailAddress: '' },
        },
      );

      expect(cloneDeep(result.data!.patientExternalProviderEdit)).toMatchObject({
        patientId: patient.id,
        firstName: 'Luna',
        lastName: 'Lovegood',
        role: 'dermatology',
        agencyName: 'Quibbler',
        roleFreeText: null,
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: null,
      });
      expect(log).toBeCalled();

      const patientExternalProviderEmail = await PatientExternalProviderEmail.getForPatientExternalProvider(
        result.data!.patientExternalProviderEdit.id,
        txn,
      );
      expect(patientExternalProviderEmail).not.toBeNull();
      expect(patientExternalProviderEmail).toHaveLength(0);
    });
  });
});
