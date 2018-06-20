import React from 'react';
import { graphql } from 'react-apollo';
import questionGraphql from '../graphql/queries/get-question.graphql';
import { questionConditionDeleteVariables, FullAnswer, FullQuestion } from '../graphql/types';
import styles from './css/risk-area-row.css';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions {
  variables: questionConditionDeleteVariables;
}

interface IProps {
  answer: FullAnswer;
  questionId: string;
}

interface IGraphqlProps {
  question?: FullQuestion;
}

class QuestionConditionRowText extends React.Component<IProps & IGraphqlProps> {
  render() {
    const { question, answer } = this.props;
    const conditionText =
      question && answer ? formatQuestionCondition(question, answer) : 'loading';
    return <div className={styles.title}>{conditionText}</div>;
  }
}

export default graphql(questionGraphql, {
  options: (props: IProps) => ({
    variables: { questionId: props.questionId },
  }),
  props: ({ data }): IGraphqlProps => ({
    question: data ? (data as any).question : null,
  }),
})(QuestionConditionRowText);
