import { patient, question, riskAreaAssessmentSubmission } from '../../util/test-data';
import { createPatientAnswer } from '../patient-answer-create-mutation';

describe('optimisticly updates the patient answer', () => {
  const oldDate = Date.now;
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('updates patient answer', () => {
    const mutate = jest.fn();
    const value = 'mah value';
    createPatientAnswer(
      mutate,
      {
        filterType: 'riskArea' as any,
        filterId: riskAreaAssessmentSubmission.riskAreaId,
        patientId: patient.id,
      },
      patient.id,
      riskAreaAssessmentSubmission.id,
      'riskArea',
    )(question, [{ answerId: question.answers[0].id, value }]);
    const response = {
      optimisticResponse: {
        __typename: 'Mutation',
        patientAnswersCreate: [
          expect.objectContaining({
            __typename: 'PatientAnswer',
            answer: {
              concernSuggestions: [],
              createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
              deletedAt: null,
              displayValue: 'answer value',
              goalSuggestions: [],
              id: 'answer-id',
              inSummary: true,
              order: 1,
              questionId: 'cool-task-id',
              riskAdjustmentType: 'increment',
              riskArea: null,
              screeningTool: null,
              summaryText: 'summary text',
              updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
              value: 'true',
              valueType: 'boolean',
            },
            answerId: 'answer-id',
            answerValue: 'mah value',
            applicable: true,
            createdAt: '2017-07-19T20:06:19.252Z',
            deletedAt: null,
            patientId: 'patient-id',
            patientScreeningToolSubmissionId: null,
            question: {
              __typename: 'Question',
              answerType: 'radio',
              answers: [
                {
                  concernSuggestions: [],
                  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
                  deletedAt: null,
                  displayValue: 'answer value',
                  goalSuggestions: [],
                  id: 'answer-id',
                  inSummary: true,
                  order: 1,
                  questionId: 'cool-task-id',
                  riskAdjustmentType: 'increment',
                  riskArea: null,
                  screeningTool: null,
                  summaryText: 'summary text',
                  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
                  value: 'true',
                  valueType: 'boolean',
                },
              ],
              applicableIfQuestionConditions: [
                { answerId: 'answer-id', id: 'question-condition', questionId: 'cool-question-id' },
              ],
              applicableIfType: 'allTrue',
              computedField: null,
              computedFieldId: null,
              createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
              deletedAt: null,
              id: 'cool-question-id',
              order: 1,
              otherTextAnswerId: null,
              riskAreaId: 'risk-area-id',
              screeningToolId: null,
              title: 'Question Title',
              updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
              validatedSource: 'validated source',
            },
            questionId: 'cool-question-id',
            updatedAt: '2017-07-19T20:06:19.252Z',
          }),
        ],
      },
      variables: {
        patientAnswers: [
          {
            answerId: 'answer-id',
            answerValue: 'mah value',
            applicable: true,
            patientId: 'patient-id',
            questionId: 'cool-question-id',
          },
        ],
        patientId: 'patient-id',
        patientScreeningToolSubmissionId: null,
        progressNoteId: null,
        questionIds: ['cool-question-id'],
        riskAreaAssessmentSubmissionId: 'risk-area-id',
      },
    };

    expect(mutate).toBeCalledWith(expect.objectContaining(response));
  });
});
