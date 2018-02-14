import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanUpdateEvent from '../../models/care-plan-update-event';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientAnswerEvent from '../../models/patient-answer-event';
import PatientConcern from '../../models/patient-concern';
import ProgressNote from '../../models/progress-note';
import Question from '../../models/question';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  cleanCarePlanUpdateEvents,
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    user,
    patient,
    riskAreaAssessmentSubmission,
  };
}

describe('progress note resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets activity for a progress note', async () => {
    await transaction(ProgressNote.knex(), async txn => {
      // Lots and lots of setup :-(
      const { patient, user, riskAreaAssessmentSubmission } = await setup(txn);
      const progressNote = await ProgressNote.autoOpenIfRequired(
        {
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const task = await Task.create(
        {
          title: 'Task Title',
          description: 'Task description',
          dueAt: new Date().toISOString(),
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );
      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
          progressNoteId: progressNote.id,
        },
        txn,
      );
      const concern = await Concern.create({ title: 'Concern Title' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          patientId: patient.id,
          concernId: concern.id,
          userId: user.id,
        },
        txn,
      );
      await cleanCarePlanUpdateEvents(patient.id, txn);
      const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
          eventType: 'create_patient_concern',
          progressNoteId: progressNote.id,
        },
        txn,
      );
      const riskArea = await createRiskArea({ title: 'Risk Area Title', order: 2 }, txn);
      const question = await Question.create(
        {
          riskAreaId: riskArea.id,
          title: 'Question Title',
          answerType: 'dropdown',
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer = await Answer.create(
        {
          questionId: question.id,
          displayValue: '1',
          value: '1',
          valueType: 'number',
          order: 1,
          inSummary: false,
        },
        txn,
      );
      const patientAnswer = (await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              answerId: answer.id,
              questionId: question.id,
              answerValue: answer.value,
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      ))[0];
      await cleanPatientAnswerEvents(patient.id, txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
          progressNoteId: progressNote.id,
        },
        txn,
      );
      // Phew, setup done

      const query = `{
        progressNoteActivityForProgressNote(
          progressNoteId: "${progressNote.id}",
        ) {
          taskEvents { id }
          patientAnswerEvents { id }
          carePlanUpdateEvents { id }
        }
      }`;
      const result = await graphql(schema, query, null, { permissions, userId: user.id, txn });
      const clonedResults = cloneDeep(result.data!.progressNoteActivityForProgressNote);
      expect(clonedResults.taskEvents.length).toEqual(1);
      expect(clonedResults.patientAnswerEvents.length).toEqual(1);
      expect(clonedResults.carePlanUpdateEvents.length).toEqual(1);
      expect(clonedResults.taskEvents[0].id).toEqual(taskEvent.id);
      expect(clonedResults.patientAnswerEvents[0].id).toEqual(patientAnswerEvent.id);
      expect(clonedResults.carePlanUpdateEvents[0].id).toEqual(carePlanUpdateEvent.id);
    });
  });
});
