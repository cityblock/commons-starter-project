import * as kue from 'kue';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientSiuEvent from '../../models/patient-siu-event';
import { createMockClinic, createPatient } from '../../spec-helpers';
import { processNewSchedulingMessage } from '../scheduling-consumer';

const queue = kue.createQueue();

interface ISetup {
  patient: Patient;
  clinic: Clinic;
}

const EVENT_DATA = {
  eventType: 'New',
  transmissionId: 230086677,
  visitId: '4557',
  dateTime: '2018-04-17T12:30:00.000Z',
  duration: 15,
  status: 'Scheduled',
  reason: null,
  cancelReason: null,
  instructions: [
    'Please arrive 15 minutes prior to scheduled appointment time to complete required paperwork. Check in with the reception staff as soon as you arrive. This will allow time to complete required paperwork if needed.',
    'Please bring your current legal photo ID, current insurance card and any referrals (if applicable)  to ALL of your appointments. Just as a reminder all applicable copays are due at time of service.',
    'If you will be late to your appointment, please call the appropriate medical office.',
  ],
  facility: 'WHMO',
  facilityType: null,
  facilityDepartment: 'WHMO INTERNAL MED',
  facilityRoom: null,
  provider: {
    id: null,
    idType: null,
    credentials: [],
    firstName: 'Navarra',
    lastName: 'Rodriguez',
  },
  attendingProvider: {
    id: null,
    idType: null,
    credentials: [],
    firstName: null,
    lastName: null,
  },
  consultingProvider: {
    id: null,
    idType: null,
    credentials: [],
    firstName: null,
    lastName: null,
  },
  referringProvider: {
    id: null,
    idType: null,
    credentials: [],
    firstName: null,
    lastName: null,
  },
  diagnoses: [
    {
      code: null,
      codeset: null,
      name: null,
      diagnosisType: null,
    },
    {
      code: 'Hello',
      codeset: 'SNOMED',
      name: 'Fake Diagnosis',
      diagnosisType: 'Bad',
    },
  ],
};

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    clinic,
    patient,
  };
}

describe('processing SIU scheduling jobs', () => {
  let txn = null as any;

  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();

    await Db.get();
    txn = await transaction.start(PatientSiuEvent.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...

    await Db.release();
  });

  it('throws an error if data is missing', async () => {
    const data = {
      patientId: uuid(),
    };

    await expect(processNewSchedulingMessage(data as any, txn)).rejects.toMatch(
      'Missing either patientId, eventType, transmissionId, visitId, dateTime, or duration',
    );
  });

  describe('with a new calendar event', () => {
    it('creates a new calendar event', async () => {
      // TODO: get Nock to work

      const { patient } = await setup(txn);
      const data = {
        ...EVENT_DATA,
        patientId: patient.id,
      };
      await processNewSchedulingMessage(data as any, txn);

      const siuEvent = await PatientSiuEvent.getByVisitId(data.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(siuEvent!.transmissionId).toBe(data.transmissionId);
      expect(siuEvent!.googleEventId).toBeTruthy();
    });
  });

  describe('with an existing patient', () => {
    it('updates an existing patient', async () => {
      // TODO
    });
  });
});
