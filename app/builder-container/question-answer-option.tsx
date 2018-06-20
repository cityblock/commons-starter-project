import React from 'react';
import { graphql } from 'react-apollo';
import questionGraphql from '../graphql/queries/get-question.graphql';
import { questionConditionDeleteVariables, FullAnswer, FullQuestion } from '../graphql/types';
import Option from '../shared/library/option/option';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions {
  variables: questionConditionDeleteVariables;
}

interface IProps {
  answer: FullAnswer;
}

interface IGraphqlProps {
  question?: FullQuestion;
}

class QuestionAnswerOption extends React.Component<IProps & IGraphqlProps> {
  render() {
    const { question, answer } = this.props;
    const conditionText =
      question && answer ? formatQuestionCondition(question, answer) : 'loading';
    return <Option value={answer.id} label={conditionText} />;
  }
}

export default graphql(questionGraphql, {
  options: (props: IProps) => ({
    variables: { questionId: props.answer.questionId },
  }),
  props: ({ data }): IGraphqlProps => ({
    question: data ? (data as any).question : null,
  }),
})(QuestionAnswerOption);
