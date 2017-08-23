import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as questionsQuery from '../graphql/queries/get-questions-for-risk-area.graphql';
import * as questionDeleteMutation from '../graphql/queries/question-delete-mutation.graphql';
import {
  questionDeleteMutationVariables,
  FullQuestionFragment,
  FullRiskAreaFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/two-panel-admin.css';
import Question from './question';
import QuestionCreate from './question-create';
import { QuestionRow } from './question-row';

export interface IComponentProps {
  routeBase: string;
  riskAreaId?: string;
  riskAreas?: FullRiskAreaFragment[];
  questionId?: string;
}

export interface IProps extends IComponentProps {
  loading?: boolean;
  error?: string;
  deleteQuestion: (
    options: { variables: questionDeleteMutationVariables },
  ) => { data: { questionDelete: FullQuestionFragment } };
  redirectToQuestions: () => any;
  questions?: FullQuestionFragment[];
  questionsRefetch: (variables: { riskAreaId: string }) => any;
  directToRiskAreaQuestions: (riskAreaId: string) => any;
}

export interface IState {
  showCreateQuestion: false;
}

class AdminQuestions extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderQuestions = this.renderQuestions.bind(this);
    this.renderQuestion = this.renderQuestion.bind(this);
    this.showCreateQuestion = this.showCreateQuestion.bind(this);
    this.hideCreateQuestion = this.hideCreateQuestion.bind(this);
    this.onDeleteQuestion = this.onDeleteQuestion.bind(this);
    this.onSortChange = this.onSortChange.bind(this);

    this.state = {
      showCreateQuestion: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error, riskAreaId } = nextProps;
    this.setState(() => ({ loading, error }));
    if (riskAreaId && riskAreaId !== this.props.riskAreaId) {
      this.props.questionsRefetch({ riskAreaId });
    }
  }

  onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    this.props.directToRiskAreaQuestions(value);
  }

  showCreateQuestion() {
    this.setState(() => ({ showCreateQuestion: true }));
  }

  hideCreateQuestion(question?: FullQuestionFragment) {
    this.setState(() => ({ showCreateQuestion: false }));
  }

  renderQuestions(questions: FullQuestionFragment[]) {
    const { loading, error } = this.props;
    const validQuestions = questions.filter(question => !question.deletedAt);

    if (validQuestions.length > 0) {
      return validQuestions.map(this.renderQuestion);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo}></div>
          <div className={styles.emptyLabel}>No Questions</div>
        </div>
      );
    }
  }

  renderQuestion(question: FullQuestionFragment) {
    const selected = question.id === this.props.questionId;
    return (
      <QuestionRow
        key={question.id}
        question={question}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  }

  async onDeleteQuestion(questionId: string) {
    const { redirectToQuestions, deleteQuestion } = this.props;

    await deleteQuestion({ variables: { questionId } });

    redirectToQuestions();
  }

  render() {
    const {
      questions,
      routeBase,
      questionId,
      riskAreas,
      riskAreaId,
    } = this.props;
    const { showCreateQuestion } = this.state;
    const questionsList = questions || [];
    const questionContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!questionId || showCreateQuestion,
    });
    const questionsListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!questionId || showCreateQuestion,
    });
    const createQuestionButton = (
      <div className={styles.createContainer}>
        <div
          onClick={this.showCreateQuestion}
          className={styles.createButton}>Create Question</div>
      </div>
    );
    const createQuestionHtml = showCreateQuestion ? (
      <QuestionCreate
        riskAreaId={riskAreaId}
        onClose={this.hideCreateQuestion}
        routeBase={this.props.routeBase} />
    ) : null;
    const renderedQuestion = (props: any) => (
      <Question
        questions={questions}
        routeBase={routeBase}
        onDelete={this.onDeleteQuestion}
        {...props } />
    );
    const questionHtml = showCreateQuestion ?
      null : (<Route path={`${routeBase}/:questionId`} render={renderedQuestion} />);
    const sortOptions = (riskAreas || []).map(riskArea => (
      <option key={riskArea.id} value={riskArea.id}>{riskArea.title}</option>
    ));
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Questions for domain:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={riskAreaId} onChange={this.onSortChange}>
                {sortOptions}
              </select>
            </div>
          </div>
          {createQuestionButton}
        </div>
        <div className={styles.bottomContainer}>
          <div className={questionsListStyles}>
            {this.renderQuestions(questionsList)}
          </div>
          <div className={questionContainerStyles}>
            {questionHtml}
            {createQuestionHtml}
          </div>
        </div>
      </div>
    );
  }
}

function getPageParams(props: IProps) {
  const { riskAreaId } = props;
  return { riskAreaId };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToQuestions: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
    directToRiskAreaQuestions: (riskAreaId: string) => {
      dispatch(push(`/admin/domains/${riskAreaId}/questions`));
    },
  };
}

export default (compose)(
  connect<any, any, IComponentProps>(null, mapDispatchToProps),
  graphql(questionDeleteMutation as any, { name: 'deleteQuestion' }),
  graphql(questionsQuery as any, {
    options: (props: IProps) => ({
      variables: getPageParams(props),
    }),
    props: ({ data, ownProps }) => ({
      questionsRefetch: (data ? data.refetch : false),
      questionsLoading: (data ? data.loading : false),
      questionsError: (data ? data.error : null),
      questions: (data ? (data as any).questionsForRiskArea : null),
    }),
  }),
)(AdminQuestions);
