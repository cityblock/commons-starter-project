import * as React from 'react';
import { graphql } from 'react-apollo';
import * as questionQuery from '../graphql/queries/get-question.graphql';
import {
  questionConditionDeleteMutationVariables,
  FullAnswerFragment,
  FullQuestionFragment,
} from '../graphql/types';
import Option from '../shared/library/option/option';
import formatQuestionCondition from './helpers/format-question-condition';

export interface IDeleteOptions {
  variables: questionConditionDeleteMutationVariables;
}

interface IProps {
  answer: FullAnswerFragment;
}

interface IGraphqlProps {
  question?: FullQuestionFragment;
}

class QuestionAnswerOption extends React.Component<IProps & IGraphqlProps> {
  render() {
    const { question, answer } = this.props;
    const conditionText =
      question && answer ? formatQuestionCondition(question, answer) : 'loading';
    return <Option value={answer.id} label={conditionText} />;
  }
}

export default graphql<IGraphqlProps, IProps>(questionQuery as any, {
  options: (props: IProps) => ({
    variables: { questionId: props.answer.questionId },
  }),
  props: ({ data }) => ({
    question: data ? (data as any).question : null,
  }),
})(QuestionAnswerOption);
