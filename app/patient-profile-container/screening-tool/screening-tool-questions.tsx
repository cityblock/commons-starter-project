import React from 'react';
import { Mutation } from 'react-apollo';
import patientAnswersCreateMutationGraphql from '../../graphql/queries/patient-answers-create-mutation.graphql';
import { AnswerFilterType, FullQuestionFragment } from '../../graphql/types';
import { createPatientAnswer } from '../../shared/patient-answer-create-mutation/patient-answer-create-mutation';
import PatientQuestion from '../../shared/question/patient-question';
import { getQuestionVisibility, IQuestionAnswerHash } from '../../shared/question/question-helpers';

interface IProps {
  patientId: string;
  screeningToolSubmissionId: string;
  screeningToolQuestions: FullQuestionFragment[];
  answerHash: IQuestionAnswerHash;
  isEditable: boolean;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class ScreeningToolQuestions extends React.Component<IProps> {
  renderScreeningToolQuestion = (question: FullQuestionFragment, index: number) => {
    const { answerHash, isEditable, patientId, screeningToolSubmissionId } = this.props;
    const visible = getQuestionVisibility(question, answerHash);
    const dataForQuestion = answerHash[question.id] || [];

    return (
      <Mutation mutation={patientAnswersCreateMutationGraphql} key={`${question.id}-${index}`}>
        {mutate => (
          <PatientQuestion
            editable={isEditable}
            visible={visible}
            displayHamburger={false}
            answerData={dataForQuestion}
            onChange={createPatientAnswer(
              mutate,
              {
                filterType: 'screeningTool' as AnswerFilterType,
                filterId: screeningToolSubmissionId,
                patientId,
              },
              patientId,
              screeningToolSubmissionId,
              'screeningTool',
            )}
            key={`${question.id}-${index}`}
            question={question}
          />
        )}
      </Mutation>
    );
  };

  render() {
    const { screeningToolQuestions } = this.props;

    return (screeningToolQuestions || []).map((question, index) =>
      this.renderScreeningToolQuestion(question, index),
    );
  }
}

export default ScreeningToolQuestions;
