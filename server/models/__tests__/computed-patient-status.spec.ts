import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import PatientDataFlag from '../patient-data-flag';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
  progressNoteTemplate: ProgressNoteTemplate;
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'title',
    },
    txn,
  );
  return { clinic, user, patient, progressNoteTemplate };
}

describe('computed patient status model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets a computed patient status for a patient', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus).not.toBeNull();
    });
  });

  it('updates and gets a computed patient status for a patient', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );

      const updatedComputedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );
      expect(updatedComputedPatientStatus.hasProgressNote).toEqual(true);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );
      expect(refetchedComputedPatientStatus).toMatchObject(updatedComputedPatientStatus);
    });
  });

  it('updates computed patient statuses for all patients', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { clinic, patient, user } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 456, homeClinicId: clinic.id }, txn);

      const computedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
      const computedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

      expect(computedPatientStatus1!.hasCareTeamMember).toEqual(false);
      expect(computedPatientStatus2!.hasCareTeamMember).toEqual(false);

      await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
      await CareTeam.create({ userId: user.id, patientId: patient2.id }, txn);

      await ComputedPatientStatus.updateForAllPatients(user.id, txn);

      const refetchedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
      const refetchedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

      expect(refetchedPatientStatus1!.hasCareTeamMember).toEqual(true);
      expect(refetchedPatientStatus2!.hasCareTeamMember).toEqual(true);
    });
  });

  it('correctly calculates hasCareTeamMember', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.hasCareTeamMember).toEqual(false);

      await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.hasCareTeamMember).toEqual(true);
    });
  });

  it('correctly calculates hasProgresNote', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { user, patient, progressNoteTemplate } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.hasProgressNote).toEqual(false);

      await ProgressNote.create(
        {
          userId: user.id,
          patientId: patient.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.hasProgressNote).toEqual(true);
    });
  });

  describe('coreIdVerified', () => {
    it('correctly calculates coreIdVerified when verified', async () => {
      await transaction(ComputedPatientStatus.knex(), async txn => {
        const { user, patient } = await setup(txn);
        const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

        expect(computedPatientStatus!.coreIdVerified).toEqual(false);

        await Patient.edit(
          {
            coreIdentityVerifiedAt: new Date().toISOString(),
            coreIdentityVerifiedById: user.id,
          },
          patient.id,
          txn,
        );
        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.coreIdVerified).toEqual(true);
      });
    });

    it('correctly calculates coreIdVerified when flagged', async () => {
      await transaction(ComputedPatientStatus.knex(), async txn => {
        const { user, patient } = await setup(txn);
        const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

        expect(computedPatientStatus!.coreIdVerified).toEqual(false);

        await PatientDataFlag.create(
          {
            userId: user.id,
            patientId: patient.id,
            fieldName: 'firstName',
          },
          txn,
        );
        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.coreIdVerified).toEqual(true);
      });
    });
  });
});
