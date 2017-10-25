import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as questionQuery from '../graphql/queries/get-question.graphql';
import {
  questionConditionDeleteMutationVariables,
  FullAnswerFragment,
  FullQuestionFragment,
} from '../graphql/types';
import * as styles from './css/risk-area-row.css';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions {
  variables: questionConditionDeleteMutationVariables;
}

interface IProps {
  question?: FullQuestionFragment;
  answer: FullAnswerFragment;
  questionId: string;
}

class QuestionConditionRowText extends React.Component<IProps> {
  render() {
    const { question, answer } = this.props;
    const conditionText =
      question && answer ? formatQuestionCondition(question, answer) : 'loading';
    return <div className={styles.title}>{conditionText}</div>;
  }
}

export default compose(
  graphql(questionQuery as any, {
    options: (props: IProps) => ({
      variables: { questionId: props.questionId },
    }),
    props: ({ data }) => ({
      question: data ? (data as any).question : null,
    }),
  }),
)(QuestionConditionRowText);
