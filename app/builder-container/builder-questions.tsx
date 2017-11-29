import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as progressNoteTemplatesQuery from '../graphql/queries/get-progress-note-templates.graphql';
import * as questionsQuery from '../graphql/queries/get-questions.graphql';
import * as riskAreasQuery from '../graphql/queries/get-risk-areas.graphql';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools.graphql';
import * as questionDeleteMutationGraphql from '../graphql/queries/question-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  questionDeleteMutation,
  questionDeleteMutationVariables,
  FullProgressNoteTemplateFragment,
  FullQuestionFragment,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from '../shared/css/two-panel.css';
import { IState as IAppState } from '../store';
import Question from './question';
import QuestionCreate from './question-create';
import { QuestionRow } from './question-row';

interface IProps {
  match: {
    params: {
      riskAreaId?: string;
      progressNoteTemplateId?: string;
      toolId?: string;
      questionId?: string;
    };
  };
}

interface IGraphqlProps {
  riskAreas?: FullRiskAreaFragment[];
  screeningTools?: FullScreeningToolFragment[];
  progressNoteTemplates?: FullProgressNoteTemplateFragment[];
  loading?: boolean;
  error?: string;
  deleteQuestion: (
    options: { variables: questionDeleteMutationVariables },
  ) => { data: questionDeleteMutation };
  questions?: FullQuestionFragment[];
  questionsRefetch?: (
    variables: { riskAreaId?: string; progressNoteTemplateId?: string; screeningToolId?: string },
  ) => any;
}

interface IStateProps {
  questionId?: string;
  routeBase: string;
  riskAreaId?: string;
  progressNoteTemplateId?: string;
  toolId?: string;
}

interface IDispatchProps {
  redirectToQuestions: () => any;
  directToRiskAreaQuestions: (riskAreaId: string) => any;
  directToScreeningToolQuestions: (screeningToolId: string) => any;
  directToProgressNoteTemplateQuestions: (progressNoteTemplateId: string) => any;
}

type allProps = IProps & IGraphqlProps & IDispatchProps & IStateProps;

interface IState {
  showCreateQuestion: boolean;
  loading?: boolean;
  error?: string;
}

class BuilderQuestions extends React.Component<allProps, IState> {
  constructor(props: allProps) {
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

  componentWillReceiveProps(nextProps: allProps) {
    const {
      loading,
      error,
      riskAreaId,
      toolId,
      progressNoteTemplateId,
      directToRiskAreaQuestions,
      riskAreas,
      questionsRefetch,
    } = nextProps;

    if (!riskAreaId && !toolId && !progressNoteTemplateId && riskAreas) {
      return directToRiskAreaQuestions(riskAreas[0].id);
    }

    if (questionsRefetch) {
      this.setState({ loading, error });
      if (riskAreaId && riskAreaId !== this.props.riskAreaId) {
        questionsRefetch({ riskAreaId });
      }

      if (progressNoteTemplateId && riskAreaId !== this.props.progressNoteTemplateId) {
        questionsRefetch({ progressNoteTemplateId });
      }

      if (toolId && toolId !== this.props.toolId) {
        questionsRefetch({ screeningToolId: toolId });
      }
    }
  }

  onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    const optionType = (event.target.options[event.target.selectedIndex].dataset as any).optiontype;

    if (optionType === 'riskArea') {
      this.props.directToRiskAreaQuestions(value);
    } else if (optionType === 'screeningTool') {
      this.props.directToScreeningToolQuestions(value);
    } else if (optionType === 'progressNoteTemplate') {
      this.props.directToProgressNoteTemplateQuestions(value);
    }
  }

  showCreateQuestion() {
    this.setState({ showCreateQuestion: true });
  }

  hideCreateQuestion(question?: FullQuestionFragment) {
    this.setState({ showCreateQuestion: false });
  }

  renderQuestions(questions: FullQuestionFragment[]) {
    const { loading, error } = this.props;
    const validQuestions = questions.filter(question => !question.deletedAt);

    if (validQuestions.length > 0) {
      return validQuestions.map(this.renderQuestion);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
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
      questionId,
      riskAreas,
      riskAreaId,
      screeningTools,
      toolId,
      routeBase,
      progressNoteTemplateId,
      progressNoteTemplates,
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
        <div onClick={this.showCreateQuestion} className={styles.createButton}>
          Create Question
        </div>
      </div>
    );

    const createQuestionHtml = showCreateQuestion ? (
      <QuestionCreate
        riskAreaId={riskAreaId}
        screeningToolId={toolId}
        progressNoteTemplateId={progressNoteTemplateId}
        onClose={this.hideCreateQuestion}
        routeBase={routeBase}
      />
    ) : null;
    const renderedQuestion = (props: any) => (
      <Question
        questions={questions}
        routeBase={routeBase}
        onDelete={this.onDeleteQuestion}
        {...props}
      />
    );
    const questionHtml = showCreateQuestion ? null : (
      <Route path={`${routeBase}/:questionId`} render={renderedQuestion} />
    );
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
    const progressNoteTemplateSortOptions = (progressNoteTemplates || []).map(
      progressNoteTemplate => (
        <option
          key={progressNoteTemplate.id}
          value={progressNoteTemplate.id}
          data-optiontype={'progressNoteTemplate'}
        >
          {progressNoteTemplate.title}
        </option>
      ),
    );
    const sortOptions = riskAreaSortOptions
      .concat(screeningToolSortOptions)
      .concat(progressNoteTemplateSortOptions);
    const selectedValue = toolId || riskAreaId || progressNoteTemplateId;
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>
              Questions for domain/tool/progress note template:
            </div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={selectedValue} onChange={this.onSortChange}>
                {sortOptions}
              </select>
            </div>
          </div>
          {createQuestionButton}
        </div>
        <div className={styles.bottomContainer}>
          <div className={questionsListStyles}>{this.renderQuestions(questionsList)}</div>
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
  const { match } = props;
  if (match.params.riskAreaId && match.params.riskAreaId !== 'redirect') {
    return {
      filterType: 'riskArea',
      filterId: match.params.riskAreaId,
    };
  } else if (match.params.toolId) {
    return {
      filterType: 'screeningTool',
      filterId: match.params.toolId,
    };
  } else if (match.params.progressNoteTemplateId) {
    return {
      filterType: 'progressNoteTemplate',
      filterId: match.params.progressNoteTemplateId,
    };
  }
  return {
    filterId: undefined,
  };
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  let routeBase = '';
  let selectedValue = '';
  if (ownProps.match.params.toolId) {
    selectedValue = ownProps.match.params.toolId;
    routeBase = `/builder/tools/${selectedValue}/questions`;
  } else if (ownProps.match.params.riskAreaId && ownProps.match.params.riskAreaId !== 'redirect') {
    selectedValue = ownProps.match.params.riskAreaId;
    routeBase = `/builder/domains/${selectedValue}/questions`;
  } else if (ownProps.match.params.progressNoteTemplateId) {
    selectedValue = ownProps.match.params.progressNoteTemplateId;
    routeBase = `/builder/progress-note-templates/${selectedValue}/questions`;
  }
  return {
    questionId: ownProps.match.params.questionId,
    toolId: ownProps.match.params.toolId,
    progressNoteTemplateId: ownProps.match.params.progressNoteTemplateId,
    riskAreaId:
      ownProps.match.params.riskAreaId !== 'redirect'
        ? ownProps.match.params.riskAreaId
        : undefined, // Hack to allow us to link to this page w/o knowing about risk areas
    routeBase,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<() => void>,
  ownProps: IProps & IStateProps,
): IDispatchProps {
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
    directToProgressNoteTemplateQuestions: (progressNoteTemplateId: string) => {
      dispatch(push(`/builder/progress-note-templates/${progressNoteTemplateId}/questions`));
    },
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(mapStateToProps as any, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(questionDeleteMutationGraphql as any, {
    name: 'deleteQuestion',
  }),
  graphql<IGraphqlProps, IProps, allProps>(questionsQuery as any, {
    options: (props: IProps) => ({
      variables: getPageParams(props),
    }),
    skip: (props: IProps) => !getPageParams(props).filterId,
    props: ({ data, ownProps }) => ({
      questionsRefetch: data ? data.refetch : false,
      questionsLoading: data ? data.loading : false,
      questionsError: data ? data.error : null,
      questions: data ? (data as any).questions : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreasQuery as any, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(progressNoteTemplatesQuery as any, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
)(BuilderQuestions);
