import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as questionsQuery from '../graphql/queries/get-questions-for-risk-area-or-screening-tool.graphql';
/* tslint:enable:max-line-length */
import * as questionDeleteMutation from '../graphql/queries/question-delete-mutation.graphql';
import {
  questionDeleteMutationVariables,
  FullQuestionFragment,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from '../shared/css/two-panel.css';
import Question from './question';
import QuestionCreate from './question-create';
import { QuestionRow } from './question-row';

export interface IComponentProps {
  routeBase: string;
  riskAreaId?: string;
  riskAreas?: FullRiskAreaFragment[];
  screeningToolId?: string;
  screeningTools?: FullScreeningToolFragment[];
  questionId?: string;
}

interface IProps extends IComponentProps {
  loading?: boolean;
  error?: string;
  deleteQuestion: (
    options: { variables: questionDeleteMutationVariables },
  ) => { data: { questionDelete: FullQuestionFragment } };
  redirectToQuestions: () => any;
  questions?: FullQuestionFragment[];
  questionsRefetch: (variables: { riskAreaId: string }) => any;
  directToRiskAreaQuestions: (riskAreaId: string) => any;
  directToScreeningToolQuestions: (screeningToolId: string) => any;
}

interface IState {
  showCreateQuestion: false;
}

class BuilderQuestions extends React.Component<IProps, IState> {
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
    const optionType = (event.target.options[event.target.selectedIndex].dataset as any).optiontype;

    if (optionType === 'riskArea') {
      this.props.directToRiskAreaQuestions(value);
    } else if (optionType === 'screeningTool') {
      this.props.directToScreeningToolQuestions(value);
    }
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
      screeningTools,
      screeningToolId,
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
        screeningToolId={screeningToolId}
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
    const riskAreaSortOptions = (riskAreas || []).map(riskArea => (
      <option key={riskArea.id} value={riskArea.id} data-optiontype={'riskArea'}>
        {riskArea.title}
      </option>
    ));
    const screeningToolSortOptions = (screeningTools || []).map(screeningTool => (
      <option key={screeningTool.id} value={screeningTool.id} data-optiontype={'screeningTool'}>
        {screeningTool.title}
      </option>
    ));
    const sortOptions = riskAreaSortOptions.concat(screeningToolSortOptions);
    const selectedValue = screeningToolId ? screeningToolId : riskAreaId;
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Questions for domain/tool:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={selectedValue} onChange={this.onSortChange}>
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
  const { riskAreaId, screeningToolId } = props;

  if (riskAreaId) {
    return { riskAreaId, screeningToolId: null };
  } else if (screeningToolId) {
    return { screeningToolId, riskAreaId: null };
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToQuestions: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
    directToRiskAreaQuestions: (riskAreaId: string) => {
      dispatch(push(`/builder/domains/${riskAreaId}/questions`));
    },
    directToScreeningToolQuestions: (screeningToolId: string) => {
      dispatch(push(`/builder/tools/${screeningToolId}/questions`));
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
      questions: (data ? (data as any).questionsForRiskAreaOrScreeningTool : null),
    }),
  }),
)(BuilderQuestions);
