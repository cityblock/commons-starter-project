import React from 'react';
import { compose, graphql } from 'react-apollo';
import answerGraphql from '../graphql/queries/get-answer.graphql';
import questionConditionDeleteGraphql from '../graphql/queries/question-condition-delete-mutation.graphql';
import {
  getAnswer,
  questionConditionDelete,
  questionConditionDeleteVariables,
  FullQuestionCondition,
} from '../graphql/types';
import styles from './css/risk-area-row.css';
import QuestionConditionRowText from './question-condition-row-text';

export interface IDeleteOptions {
  variables: questionConditionDeleteVariables;
}

interface IProps {
  questionCondition: FullQuestionCondition;
  mutation?: any;
}

interface IGraphqlProps {
  answer?: getAnswer['answer'];
  deleteQuestionCondition?: (options: IDeleteOptions) => { data: questionConditionDelete };
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
  graphql(answerGraphql, {
    options: (props: IProps) => ({
      variables: { answerId: props.questionCondition.answerId },
    }),
    props: ({ data }): IGraphqlProps => ({
      answer: data ? (data as any).answer : null,
    }),
  }),
  graphql(questionConditionDeleteGraphql, {
    name: 'deleteQuestionCondition',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
)(QuestionConditionRow);
