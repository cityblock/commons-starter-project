import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as questionConditionDeleteMutation from '../graphql/queries/question-condition-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  questionConditionDeleteMutationVariables,
  FullQuestionConditionFragment,
} from '../graphql/types';
import * as styles from './css/risk-area-row.css';

export interface IDeleteOptions { variables: questionConditionDeleteMutationVariables; }

export interface IProps {
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
    const { questionCondition } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.title}>{questionCondition.answerId}</div>
        <div onClick={this.onClick}>
          delete
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(questionConditionDeleteMutation as any, {
    name: 'deleteQuestionCondition',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(QuestionConditionRow as any) as any;
