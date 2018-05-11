import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
import * as patientAnswersCreate from '../../graphql/queries/patient-answers-create-mutation.graphql';
import {
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullQuestionFragment,
} from '../../graphql/types';
import PatientQuestion from '../../shared/question/patient-question';
import { getQuestionVisibility, IQuestionAnswerHash } from '../../shared/question/question-helpers';

interface IProps {
  patientId: string;
  screeningToolSubmissionId: string;
  screeningToolQuestions: FullQuestionFragment[];
  answerHash: IQuestionAnswerHash;
  isEditable: boolean;
}

interface IGraphqlProps {
  createPatientAnswers: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
}

type allProps = IGraphqlProps & IProps;

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class ScreeningTool extends React.Component<allProps> {
  onChange = (questionId: string, answers: Array<{ answerId: string; value: string | number }>) => {
    const { createPatientAnswers, screeningToolSubmissionId, patientId } = this.props;

    const updatedPatientAnswers = answers.map(answer => ({
      questionId,
      answerId: answer.answerId,
      answerValue: String(answer.value),
      patientId,
      applicable: true,
    }));

    createPatientAnswers({
      variables: {
        patientScreeningToolSubmissionId: screeningToolSubmissionId,
        patientId,
        patientAnswers: updatedPatientAnswers,
        questionIds: [questionId],
      },
    });
  };

  renderScreeningToolQuestion = (question: FullQuestionFragment, index: number) => {
    const { answerHash, isEditable } = this.props;
    const visible = getQuestionVisibility(question, answerHash);
    const dataForQuestion = answerHash[question.id] || [];

    return (
      <PatientQuestion
        editable={isEditable}
        visible={visible}
        displayHamburger={false}
        answerData={dataForQuestion}
        onChange={this.onChange}
        key={`${question.id}-${index}`}
        question={question}
      />
    );
  };

  render() {
    const { screeningToolQuestions } = this.props;

    return (screeningToolQuestions || []).map((question, index) =>
      this.renderScreeningToolQuestion(question, index),
    );
  }
}

export default graphql(patientAnswersCreate as any, {
  name: 'createPatientAnswers',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: patientAnswersQuery as any,
        variables: {
          filterType: 'screeningTool',
          filterId: props.screeningToolSubmissionId,
          patientId: props.patientId,
        },
      },
    ],
  }),
})(ScreeningTool as any);
