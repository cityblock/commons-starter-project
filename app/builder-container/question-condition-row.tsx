import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as answerQuery from '../graphql/queries/get-answer.graphql';
/* tslint:disable:max-line-length */
import * as questionConditionDeleteMutationGraphql from '../graphql/queries/question-condition-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  getAnswerQuery,
  questionConditionDeleteMutation,
  questionConditionDeleteMutationVariables,
  FullQuestionConditionFragment,
} from '../graphql/types';
import * as styles from './css/risk-area-row.css';
import QuestionConditionRowText from './question-condition-row-text';

export interface IDeleteOptions {
  variables: questionConditionDeleteMutationVariables;
}

interface IProps {
  questionCondition: FullQuestionConditionFragment;
  mutation?: any;
}

interface IGraphqlProps {
  answer?: getAnswerQuery['answer'];
  deleteQuestionCondition?: (options: IDeleteOptions) => { data: questionConditionDeleteMutation };
}

class QuestionConditionRow extends React.Component<IProps & IGraphqlProps> {
  onClick = () => {
    const { deleteQuestionCondition, questionCondition } = this.props;

    if (deleteQuestionCondition) {
      deleteQuestionCondition({ variables: { questionConditionId: questionCondition.id } });
    }
  };

  render() {
    const { answer } = this.props;
    const conditionText = answer ? (
      <QuestionConditionRowText questionId={answer.questionId} answer={answer} />
    ) : null;
    return (
      <div className={styles.container}>
        <div className={styles.title}>{conditionText}</div>
        <div onClick={this.onClick}>delete</div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(answerQuery as any, {
    options: (props: IProps) => ({
      variables: { answerId: props.questionCondition.answerId },
    }),
    props: ({ data }) => ({
      answer: data ? (data as any).answer : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(questionConditionDeleteMutationGraphql as any, {
    name: 'deleteQuestionCondition',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
)(QuestionConditionRow);
