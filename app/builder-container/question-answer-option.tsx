import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as questionQuery from '../graphql/queries/get-question.graphql';
import {
  questionConditionDeleteMutationVariables,
  FullAnswerFragment,
  FullQuestionFragment,
} from '../graphql/types';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions { variables: questionConditionDeleteMutationVariables; }

export interface IProps {
  question?: FullQuestionFragment;
  answer: FullAnswerFragment;
}

class QuestionAnswerOption extends React.Component<IProps> {

  render() {
    const { question, answer } = this.props;
    const conditionText = question && answer ?
      formatQuestionCondition(question, answer) : 'loading';
    return (
      <option value={answer.id}>{conditionText}</option>
    );
  }
}

export default compose(
  graphql(questionQuery as any, {
    options: (props: IProps) => ({
      variables: { questionId: props.answer.questionId },
    }),
    props: ({ data }) => ({
      question: (data ? (data as any).question : null),
    }),
  }),
)(QuestionAnswerOption);
