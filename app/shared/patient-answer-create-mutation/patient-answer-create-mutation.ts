import { MutationFn } from 'react-apollo';
import * as uuid from 'uuid/v4';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import {
  getPatientAnswersQuery,
  getPatientAnswersQueryVariables,
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullAnswerFragment,
  FullQuestionFragment,
  PatientAnswerInput,
} from '../../graphql/types';

export const createPatientAnswer = (
  mutate: MutationFn,
  patientAnswerVaraiables: getPatientAnswersQueryVariables,
  patientId: string,
  submissionId: string | null,
  submissionType: 'screeningTool' | 'riskArea' | 'progressNote',
) => async (
  question: FullQuestionFragment,
  answers: Array<{ answerId: string; value: string | number }>,
) => {
  const answersById: { [id: string]: FullAnswerFragment } = {};
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
  const variables: patientAnswersCreateMutationVariables = {
    riskAreaAssessmentSubmissionId: submissionType === 'riskArea' ? submissionId : null,
    patientScreeningToolSubmissionId: submissionType === 'screeningTool' ? submissionId : null,
    progressNoteId: submissionType === 'progressNote' ? submissionId : null,
    patientId,
    patientAnswers,
    questionIds: [question.id],
  };
  const optimisticResponse: patientAnswersCreateMutation['patientAnswersCreate'] = patientAnswers.map(
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
      const patientAnswersCreate = response.data.patientAnswersCreate;
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: patientAnswersQuery as any,
        variables: patientAnswerVaraiables,
      }) as getPatientAnswersQuery;

      // Filter out old patient answers for the current question
      const newPatientAnswers = data.patientAnswers.filter(
        patientAnswer =>
          patientAnswer && patientAnswer.question && question.id !== patientAnswer.question.id,
      );

      // Write our data back to the cache.
      proxy.writeQuery({
        query: patientAnswersQuery as any,
        variables: patientAnswerVaraiables,
        data: { patientAnswers: newPatientAnswers.concat(patientAnswersCreate) },
      });
    },
  });
};
