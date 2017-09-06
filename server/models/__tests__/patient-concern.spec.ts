import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import User from '../user';

const userRole = 'physician';

describe('patient concern model', () => {
  let db: Db;
  let concern: Concern;
  let patient: Patient;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    concern = await Concern.create({
      title: 'Housing',
    });
    user = await User.create({
      email: 'care@care.com',
      userRole,
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
    });
    expect(patientConcern.order).toEqual(1);
    expect(await PatientConcern.get(patientConcern.id)).toEqual(patientConcern);
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('gets concerns associated with a patient ', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
    });
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('should throw an error if a patient concern does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(PatientConcern.get(fakeId)).rejects.toMatch('No such patient concern: fakeId');
  });

  it('edits patient concern', async () => {
    const patientAnswer = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
    });
    const completedAt = new Date().toUTCString();
    const patientAnswerUpdated = await PatientConcern.update(patientAnswer.id, {
      completedAt,
    });
    expect(patientAnswerUpdated.completedAt).not.toBeNull();
  });

  it('deletes patient concern', async () => {
    const patientAnswer = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
    });
    const deletedPatientAnswer = await PatientConcern.delete(patientAnswer.id);
    expect(deletedPatientAnswer).not.toBeNull();
  });
});
