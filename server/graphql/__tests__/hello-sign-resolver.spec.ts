import { graphql, print } from 'graphql';
import kue from 'kue';
import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, PatientRelationOptions, UserRole } from 'schema';
import helloSignCreate from '../../../app/graphql/queries/hello-sign-create.graphql';
import helloSignTransfer from '../../../app/graphql/queries/hello-sign-transfer.graphql';
import Address from '../../models/address';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAddress from '../../models/patient-address';
import PatientContact from '../../models/patient-contact';
import PatientContactPhone from '../../models/patient-contact-phone';
import PatientExternalOrganization from '../../models/patient-external-organization';
import PatientInfo from '../../models/patient-info';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import {
  createMockAddress,
  createMockClinic,
  createMockPatientContact,
  createMockPatientExternalOrganization,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import { getHelloSignOptions, getPHISharingConsentOptions } from '../hello-sign-resolver';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      firstName: 'Sansa',
      lastName: 'Stark',
      dateOfBirth: '12/03/1990',
    },
    txn,
  );
  const primaryAddress = await Address.create(createMockAddress(user.id), txn);
  await PatientAddress.create({ addressId: primaryAddress.id, patientId: patient.id }, txn);
  const primaryPhone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ phoneId: primaryPhone.id, patientId: patient.id }, txn);

  await PatientInfo.edit(
    { primaryAddressId: primaryAddress.id, primaryPhoneId: primaryPhone.id, updatedById: user.id },
    patient.patientInfo.id,
    txn,
  );
  const updatedPatient = await Patient.get(patient.id, txn);

  return { user, patient: updatedPatient };
}

const permissions = 'blue';

describe('HelloSign Resolver', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const helloSignCreateMutation = print(helloSignCreate);
  const helloSignTransferMutation = print(helloSignTransfer);

  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('helloSignCreate', () => {
    it('gets a link to sign document', async () => {
      const { user, patient } = await setup(txn);

      const result = await graphql(
        schema,
        helloSignCreateMutation,
        null,
        {
          userId: user.id,
          logger,
          permissions,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
          documentType: 'textConsent',
        },
      );

      expect(result.data!.helloSignCreate).toEqual({
        url: 'www.winteriscoming.com',
        requestId: 'winIronThrone',
      });
      expect(log).toBeCalled();
    });
  });

  describe('helloSignTransfer', () => {
    it('enqueues job to download document from HelloSign', async () => {
      const { patient, user } = await setup(txn);

      await graphql(
        schema,
        helloSignTransferMutation,
        null,
        {
          userId: user.id,
          logger,
          permissions,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
          requestId: 'letsGoEevee',
          documentType: 'textConsent',
        },
      );

      expect(log).toBeCalled();
      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        requestId: 'letsGoEevee',
        documentType: 'textConsent',
      });
    });
  });

  describe('getHelloSignOptions', () => {
    it('gets options for HelloSign', async () => {
      const { patient } = await setup(txn);

      const options = await getHelloSignOptions(patient, 'textConsent' as DocumentTypeOptions, txn);

      expect(options.subject).toMatch('Sansa Stark - textConsent');
      expect(options.signers).toMatchObject([
        {
          name: 'Sansa Stark',
        },
      ]);
    });
  });

  describe('getPHISharingConsentOptions', () => {
    it('gets options for phiSharingConsent form', async () => {
      const { patient, user } = await setup(txn);
      await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization', {
          isConsentedForHiv: true,
          isConsentedForFamilyPlanning: true,
          isConsentedForGeneticTesting: true,
          isConsentedForMentalHealth: true,
        }),
        txn,
      );
      await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization 2', {
          isConsentedForHiv: true,
          isConsentedForFamilyPlanning: true,
          isConsentedForGeneticTesting: true,
          isConsentedForMentalHealth: true,
          isConsentedForStd: true,
          isConsentedForSubstanceUse: true,
        }),
        txn,
      );
      await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization no consents'),
        txn,
      );

      const phone = await Phone.create(createMockPhone('6178889903'), txn);
      const patientContact = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone, {
          isConsentedForHiv: true,
          isConsentedForStd: true,
          isConsentedForSubstanceUse: true,
          firstName: 'Hermione',
          lastName: 'Granger',
        }),
        txn,
      );
      await PatientContactPhone.create(
        { phoneId: phone.id, patientContactId: patientContact.id },
        txn,
      );

      const phone2 = await Phone.create(createMockPhone('6174549903'), txn);
      const patientContact2 = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone2, {
          isConsentedForHiv: true,
          isConsentedForFamilyPlanning: true,
          isConsentedForGeneticTesting: true,
          isConsentedForMentalHealth: true,
          isConsentedForStd: true,
          isConsentedForSubstanceUse: true,
          firstName: 'Harry',
          lastName: 'Potter',
          relationToPatient: 'friend' as PatientRelationOptions,
        }),
        txn,
      );
      await PatientContactPhone.create(
        { phoneId: phone2.id, patientContactId: patientContact2.id },
        txn,
      );

      const phone3 = await Phone.create(createMockPhone('6175569903'), txn);
      const patientContactUnconsented = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone2),
        txn,
      );
      await PatientContactPhone.create(
        { phoneId: phone3.id, patientContactId: patientContactUnconsented.id },
        txn,
      );

      const options = await getPHISharingConsentOptions(patient, txn);

      expect(options).toMatchObject({
        patient_name: 'Sansa Stark',
        home_address: '55 Washington St, Brooklyn, NY 11201',
        home_phone_number: '(123) 456-7890',
        date_of_birth: '12/03/90',
        organization_name_0: 'Test Organization',
        organization_permissions_0:
          'ALL my health information, except: Sexually transmitted diseases, Substance use disorder information',
        organization_name_1: 'Test Organization 2',
        organization_permissions_1: 'ALL my health information',
        individual_name_0: 'Hermione Granger',
        phone_number_0: '(617) 888-9903',
        relationship_0: 'parent',
        individual_name_1: 'Harry Potter',
        phone_number_1: '(617) 454-9903',
        relationship_1: 'friend',
      });
    });
  });
});
