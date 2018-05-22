import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  CarePlanUpdateEventTypes,
  PatientAnswerEventTypes,
  TaskEventTypes,
  UserRole,
} from 'schema';
import * as progressNoteActivity from '../../../app/graphql/queries/get-progress-note-activity-for-progress-note.graphql';

import Answer from '../../models/answer';
import CarePlanUpdateEvent from '../../models/care-plan-update-event';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientAnswerEvent from '../../models/patient-answer-event';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
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

const userRole = 'admin' as UserRole;
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
  const progressNoteActivityQuery = print(progressNoteActivity);
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('gets activity for a progress note', async () => {
    // Lots and lots of setup :-(
    const { patient, user, riskAreaAssessmentSubmission } = await setup(txn);
    const progressNote = await ProgressNote.autoOpenIfRequired(
      {
        patientId: patient.id,
        userId: user.id,
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
    const patientGoal = await PatientGoal.create(
      {
        patientId: patient.id,
        title: 'goal title',
        userId: user.id,
        patientConcernId: patientConcern.id,
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
        patientGoalId: patientGoal.id,
      },
      txn,
    );
    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_assignee' as TaskEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );
    await cleanCarePlanUpdateEvents(patient.id, txn);
    const carePlanUpdateEvent = await CarePlanUpdateEvent.create(
      {
        patientId: patient.id,
        userId: user.id,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );
    const riskArea = await createRiskArea({ title: 'Risk Area Title', order: 2 }, txn);
    const question = await Question.create(
      {
        riskAreaId: riskArea.id,
        title: 'Question Title',
        answerType: 'dropdown' as AnswerTypeOptions,
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
        valueType: 'number' as AnswerValueTypeOptions,
        order: 1,
        inSummary: false,
      },
      txn,
    );
    const patientAnswer = (await PatientAnswer.createForRiskArea(
      {
        patientId: patient.id,
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
        eventType: 'create_patient_answer' as PatientAnswerEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );
    // Phew, setup done
    const result = await graphql(
      schema,
      progressNoteActivityQuery,
      null,
      { permissions, userId: user.id, testTransaction: txn },
      { progressNoteId: progressNote.id },
    );
    const clonedResults = cloneDeep(result.data!.progressNoteActivityForProgressNote);
    expect(clonedResults.taskEvents.length).toEqual(1);
    expect(clonedResults.patientAnswerEvents.length).toEqual(1);
    expect(clonedResults.carePlanUpdateEvents.length).toEqual(1);
    expect(clonedResults.taskEvents[0].id).toEqual(taskEvent.id);
    expect(clonedResults.patientAnswerEvents[0].id).toEqual(patientAnswerEvent.id);
    expect(clonedResults.carePlanUpdateEvents[0].id).toEqual(carePlanUpdateEvent.id);
  });
});
