import { shallow } from 'enzyme';
import React from 'react';
import {
  patient,
  patientAnswer,
  patientAnswerFreetext,
  patientConcern,
  progressNote,
  user,
} from '../../../shared/util/test-data';
import { ProgressNoteQuestionAnswer } from '../progress-note-question-answer';
import { ProgressNoteRowQuestions } from '../progress-note-row-questions';

it('renders the progress note questions', () => {
  const component = shallow(
    <ProgressNoteRowQuestions
      progressNote={progressNote}
      patientId={patient.id}
      goToActivityTab={jest.fn()}
      answers={[patientAnswer, patientAnswerFreetext]}
      progressNoteActivity={{
        taskEvents: [],
        patientAnswerEvents: [],
        carePlanUpdateEvents: [
          {
            id: 'foo',
            patientId: patient.id,
            patient,
            userId: user.id,
            user,
            patientConcernId: patientConcern.id,
            patientConcern,
            patientGoalId: null,
            patientGoal: null,
            eventType: 'create_patient_concern' as any,
            progressNoteId: progressNote.id,
            createdAt: '2017-09-07T13:45:14.532Z',
            updatedAt: '2017-09-07T13:45:14.532Z',
            deletedAt: null,
          },
        ],
        quickCallEvents: [],
        patientScreeningToolSubmissions: [],
      }}
      progressNoteActivityError={null}
      progressNoteActivityLoading={false}
    />,
  );
  expect(component.find(ProgressNoteQuestionAnswer)).toHaveLength(2);
  expect(component.find('.linkToActivity')).toHaveLength(1);
});
