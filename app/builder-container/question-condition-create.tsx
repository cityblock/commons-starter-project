import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as questionConditionCreateMutation from '../graphql/queries/question-condition-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  questionConditionCreateMutationVariables,
  FullAnswerFragment,
  FullQuestionConditionFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as styles from './css/risk-area-create.css';
import * as questionConditionStyles from './css/two-panel-right.css';
import QuestionAnswerOption from './question-answer-option';

export interface ICreateOptions { variables: questionConditionCreateMutationVariables; }

export interface IProps {
  questionCondition?: FullQuestionConditionFragment;
  questionId: string;
  answers: FullAnswerFragment[];
  createQuestionCondition: (
    options: ICreateOptions,
  ) => { data: { questionConditionCreate: FullQuestionConditionFragment } };
}

export interface IState {
  loading: boolean;
  error?: string;
  questionCondition: {
    answerId: string;
  };
}

class QuestionConditionCreate extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    const questionCondition = props.questionCondition ? {
      answerId: props.questionCondition.answerId,
    } : { answerId: 'undefined' };

    this.state = {
      loading: false,
      questionCondition,
    };
  }

  onAnswerChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const fieldValue = event.target.value;
    const { questionCondition } = this.state;
    questionCondition.answerId = fieldValue;
    this.setState({ questionCondition });
  }

  async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const questionCondition = this.state.questionCondition;
      await this.props.createQuestionCondition({
        variables: { questionId: this.props.questionId, ...questionCondition },
      });
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
    }
    return false;
  }

  render() {
    const { answers } = this.props;
    const { loading, questionCondition } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;
    const answerOptions = answers.map((answer: FullAnswerFragment) => (
      <QuestionAnswerOption key={answer.id} answer={answer} />
    ));
    const selectedAnswer = questionCondition.answerId || '';
    return (
      <form onSubmit={this.onSubmit} className={questionConditionStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner}></div>
          </div>
        </div>
        <div className={styles.flexInputGroup}>
          <select
            name='answerId'
            value={selectedAnswer}
            onChange={this.onAnswerChange}
            className={
              classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
            <option value='' disabled hidden>Select Answer</option>
            {answerOptions}
          </select>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input
              type='submit'
              className={styles.submitButton}
              value={'Add question condition'} />
          </div>
        </div>
      </form>
    );
  }
}

export default compose(
  graphql(questionConditionCreateMutation as any, {
    name: 'createQuestionCondition',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(QuestionConditionCreate as any) as any;
