import { graphql, print } from 'graphql';
import { cloneDeep, pick } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as getPatientExternalOrganizations from '../../../app/graphql/queries/get-patient-external-organizations.graphql';
import * as patientExternalOrganizationCreate from '../../../app/graphql/queries/patient-external-organization-create-mutation.graphql';
import * as patientExternalOrganizationDelete from '../../../app/graphql/queries/patient-external-organization-delete-mutation.graphql';
import * as patientExternalOrganizationEdit from '../../../app/graphql/queries/patient-external-organization-edit-mutation.graphql';
import Address from '../../models/address';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientDocument from '../../models/patient-document';
import PatientExternalOrganization from '../../models/patient-external-organization';
import User from '../../models/user';
import {
  createMockAddress,
  createMockClinic,
  createMockPatientExternalOrganization,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'physician' as UserRole;
const permissions = 'green';

interface ISetup {
  patient: Patient;
  clinic: Clinic;
  user: User;
  organization: PatientExternalOrganization;
  address: Address;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const address = await Address.create(createMockAddress(user.id), txn);
  const organization = await PatientExternalOrganization.create(
    createMockPatientExternalOrganization(patient.id, 'Test Organization', {
      addressId: address.id,
    }),
    txn,
  );

  return { clinic, patient, user, address, organization };
}

describe('patient external organization model', () => {
  const patientExternalOrganizationsQuery = print(getPatientExternalOrganizations);
  const patientExternalOrganizationCreateMutation = print(patientExternalOrganizationCreate);
  const patientExternalOrganizationDeleteMutation = print(patientExternalOrganizationDelete);
  const patientExternalOrganizationEditMutation = print(patientExternalOrganizationEdit);
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('patient external organizations resolvers', async () => {
    it('gets all patient external organizations for patient with id', async () => {
      const { clinic, user, patient, organization } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);
      await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient2.id, 'Test Organization 2'),
        txn,
      );
      const org2 = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization delete'),
        txn,
      );
      await PatientExternalOrganization.delete(org2.id, txn);

      const result = await graphql(
        schema,
        patientExternalOrganizationsQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );

      expect(cloneDeep(result.data!.patientExternalOrganizations)).toHaveLength(1);
      expect(cloneDeep(result.data!.patientExternalOrganizations[0])).toMatchObject({
        ...pick(organization, [
          'id',
          'patientId',
          'name',
          'description',
          'phoneNumber',
          'faxNumber',
          'isConsentedForSubstanceUse',
          'isConsentedForHiv',
          'isConsentedForStd',
          'isConsentedForGeneticTesting',
          'isConsentedForFamilyPlanning',
          'consentDocumentId',
        ]),
        address: pick(organization.address, [
          'id',
          'city',
          'state',
          'street1',
          'street2',
          'zip',
          'description',
        ]),
      });
      expect(log).toBeCalled();
    });
  });

  describe('create', async () => {
    it('should create a patient external organization with all external organization fields', async () => {
      const { patient, user } = await setup(txn);
      const organizationFields = createMockPatientExternalOrganization(patient.id, 'Test org', {
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: true,
        isConsentedForGeneticTesting: false,
        isConsentedForFamilyPlanning: false,
      }) as any;
      organizationFields.address = {
        city: 'Boston',
        state: 'MA',
        street1: '1 Court St',
        street2: 'Unit 3',
        zip: '02110',
        description: 'some address for an org',
      };

      const result = await graphql(
        schema,
        patientExternalOrganizationCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        organizationFields,
      );

      const expected = { ...organizationFields, consentDocumentId: null };
      delete expected.addressId;
      expect(cloneDeep(result.data!.patientExternalOrganizationCreate)).toMatchObject(expected);
      expect(result.data!.patientExternalOrganizationCreate.address.id).toBeTruthy();
      expect(log).toBeCalled();
    });

    it('should not create organization with empty name', async () => {
      const { patient, user } = await setup(txn);
      const organizationFields = createMockPatientExternalOrganization(patient.id, '');

      const result = await graphql(
        schema,
        patientExternalOrganizationCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        organizationFields,
      );

      await expect(result.errors![0].message).toMatch(
        'name: should NOT be shorter than 1 characters',
      );
    });
  });

  describe('delete', async () => {
    it('should delete a patient external organization and all associated models', async () => {
      const { address, user, organization } = await setup(txn);

      const result = await graphql(
        schema,
        patientExternalOrganizationDeleteMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        { patientExternalOrganizationId: organization.id },
      );

      expect(cloneDeep(result.data!.patientExternalOrganizationDelete).deletedAt).not.toBeFalsy();
      expect(log).toBeCalled();
      await expect(Address.get(address.id, txn)).rejects.toMatch(`No such address: ${address.id}`);
    });
  });

  describe('edit', async () => {
    it('should edit patient external organization and create address', async () => {
      const { patient, user } = await setup(txn);
      const newOrg = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization 2'),
        txn,
      );
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );

      const result = await graphql(
        schema,
        patientExternalOrganizationEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientExternalOrganizationId: newOrg.id,
          name: 'Another name',
          description: 'some description goes here',
          phoneNumber: '4567778899',
          faxNumber: '(717)666-0022',
          address: {
            zip: '11238',
            street1: 'Main St',
            state: 'NY',
          },
          isConsentedForSubstanceUse: false,
          isConsentedForHiv: false,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: true,
          isConsentedForFamilyPlanning: true,
          consentDocumentId: consentDocument.id,
        },
      );

      expect(cloneDeep(result.data!.patientExternalOrganizationEdit)).toMatchObject({
        patientId: patient.id,
        name: 'Another name',
        description: 'some description goes here',
        phoneNumber: '+14567778899',
        faxNumber: '+17176660022',
        address: {
          zip: '11238',
          street1: 'Main St',
          state: 'NY',
        },
        isConsentedForSubstanceUse: false,
        isConsentedForHiv: false,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: true,
        consentDocumentId: consentDocument.id,
      });
      expect(log).toBeCalled();
    });

    it('should edit patient external organization and update address', async () => {
      const { patient, user, organization } = await setup(txn);

      const result = await graphql(
        schema,
        patientExternalOrganizationEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientExternalOrganizationId: organization.id,
          address: {
            zip: '11238',
            street1: 'Main St',
            state: 'NY',
          },
        },
      );

      expect(cloneDeep(result.data!.patientExternalOrganizationEdit)).toMatchObject({
        patientId: patient.id,
        address: {
          id: organization.address.id,
          zip: '11238',
          street1: 'Main St',
          state: 'NY',
        },
      });
      expect(log).toBeCalled();
    });

    it('should edit patient external organization and delete address', async () => {
      const { patient, user, organization } = await setup(txn);

      const result = await graphql(
        schema,
        patientExternalOrganizationEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientExternalOrganizationId: organization.id,
          address: {
            zip: '',
            street1: '',
            street2: '',
            state: '',
            city: '',
          },
        },
      );

      expect(cloneDeep(result.data!.patientExternalOrganizationEdit)).toMatchObject({
        patientId: patient.id,
        address: null,
      });
      expect(log).toBeCalled();
      await expect(Address.get(organization.address.id, txn)).rejects.toMatch(
        `No such address: ${organization.address.id}`,
      );
    });
  });
});
