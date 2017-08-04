import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as answerQuery from '../graphql/queries/get-answer.graphql';
import * as questionQuery from '../graphql/queries/get-question.graphql';
/* tslint:disable:max-line-length */
import * as questionConditionDeleteMutation from '../graphql/queries/question-condition-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  questionConditionDeleteMutationVariables,
  FullAnswerFragment,
  FullQuestionConditionFragment,
  FullQuestionFragment,
} from '../graphql/types';
import * as styles from './css/risk-area-row.css';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions { variables: questionConditionDeleteMutationVariables; }

export interface IProps {
  question?: FullQuestionFragment;
  answer?: FullAnswerFragment;
  questionCondition: FullQuestionConditionFragment;
  deleteQuestionCondition: (
    options: IDeleteOptions,
  ) => { data: { questionConditionDelete: FullQuestionConditionFragment } };
}

class QuestionConditionRow extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { deleteQuestionCondition, questionCondition } = this.props;
    deleteQuestionCondition({ variables: { questionConditionId: questionCondition.id } });
  }

  render() {
    const { question, answer } = this.props;
    const conditionText = question && answer ?
      formatQuestionCondition(question, answer) : 'loading';
    return (
      <div className={styles.container}>
        <div className={styles.title}>{conditionText}</div>
        <div onClick={this.onClick}>
          delete
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(questionQuery as any, {
    options: (props: IProps) => ({
      variables: { questionId: props.questionCondition.questionId },
    }),
    props: ({ data }) => ({
      question: (data ? (data as any).question : null),
    }),
  }),
  graphql(answerQuery as any, {
    options: (props: IProps) => ({
      variables: { answerId: props.questionCondition.answerId },
    }),
    props: ({ data }) => ({
      answer: (data ? (data as any).answer : null),
    }),
  }),
  graphql(questionConditionDeleteMutation as any, {
    name: 'deleteQuestionCondition',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(QuestionConditionRow as any) as any;
