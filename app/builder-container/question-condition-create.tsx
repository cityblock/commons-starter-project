import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as questionConditionCreateMutationGraphql from '../graphql/queries/question-condition-create-mutation.graphql';
import {
  questionConditionCreateMutation,
  questionConditionCreateMutationVariables,
  FullAnswerFragment,
  FullQuestionConditionFragment,
} from '../graphql/types';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as questionConditionStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import * as styles from './css/risk-area-create.css';
import QuestionAnswerOption from './question-answer-option';

export interface ICreateOptions {
  variables: questionConditionCreateMutationVariables;
}

interface IProps extends IInjectedErrorProps {
  questionCondition?: FullQuestionConditionFragment;
  questionId: string;
  answers: FullAnswerFragment[];
}

interface IGraphqlProps {
  createQuestionCondition: (options: ICreateOptions) => { data: questionConditionCreateMutation };
}

interface IState {
  loading: boolean;
  questionCondition: {
    answerId: string;
  };
}

type allProps = IProps & IGraphqlProps;

class QuestionConditionCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    const questionCondition = props.questionCondition
      ? {
          answerId: props.questionCondition.answerId,
        }
      : { answerId: '' };

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

  async onSubmit() {
    try {
      this.setState({ loading: true });
      const questionCondition = this.state.questionCondition;
      await this.props.createQuestionCondition({
        variables: { questionId: this.props.questionId, ...questionCondition },
      });
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      this.props.openErrorPopup(err.message);
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
      <div className={questionConditionStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner} />
          </div>
        </div>
        <div className={styles.flexInputGroup}>
          <Select name="answerId" value={selectedAnswer} onChange={this.onAnswerChange}>
            <Option value="" messageId="questionConditionCreate.selectAnswer" disabled={true} />
            {answerOptions}
          </Select>
        </div>
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button onClick={this.onSubmit} label={'Add question condition'} />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql<IGraphqlProps, IProps, allProps>(questionConditionCreateMutationGraphql as any, {
    name: 'createQuestionCondition',
    options: {
      refetchQueries: ['getQuestions'],
    },
  }),
)(QuestionConditionCreate);
