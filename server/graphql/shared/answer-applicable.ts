import { values } from 'lodash';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';

interface IPatientAnswersByQuestionId {
  [s: string]: PatientAnswer[];
}

/**
 * Useful way of looking at questions for later analysis
 * note that questions can have multiple answers (multiselect) so we assume all do though most
 * are an array of 1 item
 */
export function getPatientAnswersByQuestionId(
  patientAnswers: PatientAnswer[],
  questions: Question[],
): IPatientAnswersByQuestionId {
  const patientAnswersByQuestionId: { [s: string]: PatientAnswer[] } = {};

  // We eager load question -> answers but not answer -> question
  const answerIdToQuestionIdHash: { [s: string]: string } = {};
  questions.forEach(question => {
    question.answers.forEach(answer => {
      answerIdToQuestionIdHash[answer.id] = question.id;
    });
  });

  patientAnswers.forEach(answer => {
    const questionId = answerIdToQuestionIdHash[answer.answerId];
    if (!questionId) {
      throw new Error('Patient answers are not answers to the questions');
    }
    if (patientAnswersByQuestionId[questionId]) {
      patientAnswersByQuestionId[questionId].push(answer);
    } else {
      patientAnswersByQuestionId[questionId] = [answer];
    }
  });
  return patientAnswersByQuestionId;
}

export function getPatientAnswersByAnswerId(
  patientAnswersByQuestionId: IPatientAnswersByQuestionId,
) {
  const answers: { [s: string]: PatientAnswer } = {};
  values(patientAnswersByQuestionId).forEach(patientAnswers => {
    patientAnswers.forEach(patientAnswer => {
      answers[patientAnswer.answerId] = patientAnswer;
    });
  });
  return answers;
}

/**
 * Looks at all patient answers and checks if condition {questionId, answerId} hashes match up
 */
export function isQuestionApplicable(
  question: Question,
  patientAnswersByQuestionId: IPatientAnswersByQuestionId,
): boolean {
  let allTrue = true;
  let oneTrue = false;

  // always true if no conditions
  if ((question.applicableIfQuestionConditions || []).length < 1) {
    return true;
  }

  const patientAnswersByAnswerId = getPatientAnswersByAnswerId(patientAnswersByQuestionId);
  question.applicableIfQuestionConditions.forEach(condition => {
    if (patientAnswersByAnswerId[condition.answerId]) {
      oneTrue = true;
    } else {
      allTrue = false;
    }
  });
  return question.applicableIfType === 'allTrue' ? allTrue : oneTrue;
}

/**
 * Updates question applicable for all patient answers passed in
 * NOTE: Should only be used for questions and patient answers within the same domain
 */
export function updatePatientAnswerApplicable(
  patientAnswers: PatientAnswer[],
  questions: Question[],
): Array<Promise<PatientAnswer>> {
  const patientAnswersByQuestionId = getPatientAnswersByQuestionId(patientAnswers, questions);
  const editedAnswers: Array<Promise<PatientAnswer>> = [];
  questions.forEach(async question => {
    const patientAnswersForQuestion = patientAnswersByQuestionId[question.id] || [];
    const applicable = isQuestionApplicable(question, patientAnswersByQuestionId);
    patientAnswersForQuestion.forEach(async patientAnswer => {
      // TODO: Batch this operation using insertGraph
      if (applicable !== patientAnswer.applicable) {
        editedAnswers.push(PatientAnswer.editApplicable(applicable, patientAnswer.id));
      }
    });
  });
  return editedAnswers;
}
