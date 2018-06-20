import { MutationFn } from 'react-apollo';
import uuid from 'uuid/v4';
import patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import {
  getPatientAnswers,
  getPatientAnswersVariables,
  patientAnswersCreate,
  patientAnswersCreateVariables,
  FullAnswer,
  FullQuestion,
  PatientAnswerInput,
} from '../../graphql/types';

export const createPatientAnswer = (
  mutate: MutationFn,
  patientAnswerVaraiables: getPatientAnswersVariables,
  patientId: string,
  submissionId: string | null,
  submissionType: 'screeningTool' | 'riskArea' | 'progressNote',
) => async (
  question: FullQuestion,
  answers: Array<{ answerId: string; value: string | number }>,
) => {
  const answersById: { [id: string]: FullAnswer } = {};
  (question.answers || []).forEach(answer => {
    answersById[answer.id] = answer;
  });
  const patientAnswers: PatientAnswerInput[] = answers.map(answer => ({
    questionId: question.id,
    answerId: answer.answerId,
    answerValue: String(answer.value),
    patientId,
    applicable: true,
  }));
  const variables: patientAnswersCreateVariables = {
    riskAreaAssessmentSubmissionId: submissionType === 'riskArea' ? submissionId : null,
    patientScreeningToolSubmissionId: submissionType === 'screeningTool' ? submissionId : null,
    progressNoteId: submissionType === 'progressNote' ? submissionId : null,
    patientId,
    patientAnswers,
    questionIds: [question.id],
  };
  const optimisticResponse: patientAnswersCreate['patientAnswersCreate'] = patientAnswers.map(
    patientAnswer => ({
      __typename: 'PatientAnswer',
      id: uuid(),
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      deletedAt: null,
      answerId: patientAnswer.answerId,
      answerValue: patientAnswer.answerValue,
      patientId,
      applicable: true,
      patientScreeningToolSubmissionId: null,
      questionId: question.id,
      question: { __typename: 'Question', ...question },
      answer: answersById[patientAnswer.answerId],
    }),
  );
  return mutate({
    variables,
    optimisticResponse: {
      __typename: 'Mutation',
      patientAnswersCreate: optimisticResponse,
    },
    update: (proxy, response) => {
      const patientAnswersCreateResponse = response.data.patientAnswersCreate;
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: patientAnswersQuery,
        variables: patientAnswerVaraiables,
      }) as getPatientAnswers;

      // Filter out old patient answers for the current question
      const newPatientAnswers = data.patientAnswers.filter(
        patientAnswer =>
          patientAnswer && patientAnswer.question && question.id !== patientAnswer.question.id,
      );

      // Write our data back to the cache.
      proxy.writeQuery({
        query: patientAnswersQuery,
        variables: patientAnswerVaraiables,
        data: { patientAnswers: newPatientAnswers.concat(patientAnswersCreateResponse) },
      });
    },
  });
};
