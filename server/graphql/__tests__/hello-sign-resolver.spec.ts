import { graphql, print } from 'graphql';
import kue from 'kue';
import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, UserRole } from 'schema';
import helloSignCreate from '../../../app/graphql/queries/hello-sign-create.graphql';
import helloSignTransfer from '../../../app/graphql/queries/hello-sign-transfer.graphql';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { getHelloSignOptions } from '../hello-sign-resolver';
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
    { cityblockId: 123, homeClinicId: clinic.id, firstName: 'Sansa', lastName: 'Stark' },
    txn,
  );

  return { user, patient };
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

      const options = getHelloSignOptions(patient, 'textConsent' as DocumentTypeOptions);

      expect(options.subject).toMatch('Sansa Stark - textConsent');
      expect(options.signers).toMatchObject([
        {
          name: 'Sansa Stark',
        },
      ]);
    });
  });
});
