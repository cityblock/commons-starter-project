import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import computedFieldsGraphql from '../graphql/queries/get-computed-fields.graphql';
import progressNoteTemplatesGraphql from '../graphql/queries/get-progress-note-templates.graphql';
import questionsGraphql from '../graphql/queries/get-questions.graphql';
import riskAreasGraphql from '../graphql/queries/get-risk-areas.graphql';
import screeningToolsGraphql from '../graphql/queries/get-screening-tools.graphql';
import questionDeleteGraphql from '../graphql/queries/question-delete-mutation.graphql';
import {
  getQuestionsVariables,
  questionDelete,
  questionDeleteVariables,
  FullComputedField,
  FullProgressNoteTemplate,
  FullQuestion,
  FullRiskArea,
  FullScreeningTool,
  QuestionFilterType,
} from '../graphql/types';
import sortSearchStyles from '../shared/css/sort-search.css';
import styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
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
  history: History;
}

interface IGraphqlProps {
  riskAreas?: FullRiskArea[];
  screeningTools?: FullScreeningTool[];
  progressNoteTemplates?: FullProgressNoteTemplate[];
  computedFields?: FullComputedField[];
  loading?: boolean;
  error: string | null;
  deleteQuestion: (options: { variables: questionDeleteVariables }) => { data: questionDelete };
  questions?: FullQuestion[];
  questionsRefetch?: (
    variables: {
      riskAreaId?: string;
      progressNoteTemplateId?: string;
      screeningToolId?: string;
    },
  ) => any;
}

interface IStateProps {
  questionId: string | null;
  routeBase: string;
  riskAreaId: string | null;
  progressNoteTemplateId: string | null;
  toolId: string | null;
}

type allProps = IProps & IGraphqlProps & IStateProps;

interface IState {
  showCreateQuestion: boolean;
  loading?: boolean;
  error: string | null;
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
      error: null,
    };
  }

  redirectToQuestions = () => {
    const { history, routeBase } = this.props;
    history.push(routeBase);
  };
  directToRiskAreaQuestions = (riskAreaId: string) => {
    this.props.history.push(`/builder/assessments/${riskAreaId}/questions`);
  };
  directToScreeningToolQuestions = (screeningToolId: string) => {
    this.props.history.push(`/builder/tools/${screeningToolId}/questions`);
  };
  directToProgressNoteTemplateQuestions = (progressNoteTemplateId: string) => {
    this.props.history.push(`/builder/progress-note-templates/${progressNoteTemplateId}/questions`);
  };
  componentWillReceiveProps(nextProps: allProps) {
    const {
      loading,
      error,
      riskAreaId,
      toolId,
      progressNoteTemplateId,
      questionsRefetch,
    } = nextProps;

    if (!riskAreaId && !toolId && !progressNoteTemplateId && this.props.riskAreas) {
      // safeguard explosion if no risk areas
      if (!this.props.riskAreas.length) return;
      return this.directToRiskAreaQuestions(this.props.riskAreas[0].id);
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
      this.directToRiskAreaQuestions(value);
    } else if (optionType === 'screeningTool') {
      this.directToScreeningToolQuestions(value);
    } else if (optionType === 'progressNoteTemplate') {
      this.directToProgressNoteTemplateQuestions(value);
    }
  }

  showCreateQuestion() {
    this.setState({ showCreateQuestion: true });
  }

  hideCreateQuestion(question?: FullQuestion) {
    this.setState({ showCreateQuestion: false });
  }

  renderQuestions(questionsList: FullQuestion[]) {
    const { loading, error } = this.props;
    const validQuestions = questionsList.filter(question => !question.deletedAt);

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

  renderQuestion(question: FullQuestion) {
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
    const { deleteQuestion } = this.props;

    await deleteQuestion({ variables: { questionId } });

    this.redirectToQuestions();
  }

  render() {
    const {
      questionId,
      riskAreaId,
      toolId,
      routeBase,
      progressNoteTemplateId,
      questions,
      computedFields,
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
        <Button onClick={this.showCreateQuestion} messageId="builder.createQuestion" />
      </div>
    );
    const selectedRiskArea = this.props.riskAreas
      ? this.props.riskAreas.find(area => area.id === riskAreaId)
      : null;

    const createQuestionHtml = showCreateQuestion ? (
      <QuestionCreate
        riskAreaId={riskAreaId}
        assessmentType={selectedRiskArea ? selectedRiskArea.assessmentType : null}
        screeningToolId={toolId}
        progressNoteTemplateId={progressNoteTemplateId}
        onClose={this.hideCreateQuestion}
        routeBase={routeBase}
        computedFields={computedFields}
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
    const riskAreaSortOptions = (this.props.riskAreas || []).map(riskArea => (
      <option key={riskArea.id} value={riskArea.id} data-optiontype={'riskArea'}>
        {riskArea.title}
      </option>
    ));
    const screeningToolSortOptions = (this.props.screeningTools || []).map(screeningTool => (
      <option key={screeningTool.id} value={screeningTool.id} data-optiontype={'screeningTool'}>
        {screeningTool.title}
      </option>
    ));
    const progressNoteTemplateSortOptions = (this.props.progressNoteTemplates || []).map(
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
    const selectedValue = toolId || riskAreaId || progressNoteTemplateId;
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>
              Questions for assessment/tool/progress note template:
            </div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={selectedValue || ''} onChange={this.onSortChange}>
                <option value="">nothing selected</option>
                <optgroup label="Assessments">{riskAreaSortOptions}</optgroup>
                <optgroup label="Screening Tools">{screeningToolSortOptions}</optgroup>
                <optgroup label="Progress Note Templates">
                  {progressNoteTemplateSortOptions}
                </optgroup>
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

function getPageParams(props: IProps): getQuestionsVariables | null {
  const { match } = props;
  if (match.params.riskAreaId && match.params.riskAreaId !== 'redirect') {
    return {
      filterType: 'riskArea' as QuestionFilterType,
      filterId: match.params.riskAreaId,
    };
  } else if (match.params.toolId) {
    return {
      filterType: 'screeningTool' as QuestionFilterType,
      filterId: match.params.toolId,
    };
  } else if (match.params.progressNoteTemplateId) {
    return {
      filterType: 'progressNoteTemplate' as QuestionFilterType,
      filterId: match.params.progressNoteTemplateId,
    };
  }
  return null;
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  let routeBase = '';
  let selectedValue = '';
  if (ownProps.match.params.toolId) {
    selectedValue = ownProps.match.params.toolId;
    routeBase = `/builder/tools/${selectedValue}/questions`;
  } else if (ownProps.match.params.riskAreaId && ownProps.match.params.riskAreaId !== 'redirect') {
    selectedValue = ownProps.match.params.riskAreaId;
    routeBase = `/builder/assessments/${selectedValue}/questions`;
  } else if (ownProps.match.params.progressNoteTemplateId) {
    selectedValue = ownProps.match.params.progressNoteTemplateId;
    routeBase = `/builder/progress-note-templates/${selectedValue}/questions`;
  }
  return {
    questionId: ownProps.match.params.questionId || null,
    toolId: ownProps.match.params.toolId || null,
    progressNoteTemplateId: ownProps.match.params.progressNoteTemplateId || null,
    riskAreaId:
      // Hack to allow us to link to this page w/o knowing about risk areas
      ownProps.match.params.riskAreaId !== 'redirect'
        ? ownProps.match.params.riskAreaId || null
        : null,
    routeBase,
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql(questionDeleteGraphql, {
    name: 'deleteQuestion',
  }),
  graphql(questionsGraphql, {
    options: (props: IProps) => ({
      variables: getPageParams(props),
    }),
    skip: (props: IProps) => !getPageParams(props),
    props: ({ data, ownProps }) => ({
      questionsRefetch: data ? data.refetch : false,
      questionsLoading: data ? data.loading : false,
      questionsError: data ? data.error : null,
      questions: data ? (data as any).questions : null,
    }),
  }),
  graphql(riskAreasGraphql, {
    props: ({ data }) => ({
      riskAreasLoading: data ? data.loading : false,
      riskAreasError: data ? data.error : null,
      riskAreas: data ? (data as any).riskAreas : null,
    }),
  }),
  graphql(progressNoteTemplatesGraphql, {
    props: ({ data }) => ({
      progressNoteTemplatesLoading: data ? data.loading : false,
      progressNoteTemplatesError: data ? data.error : null,
      progressNoteTemplates: data ? (data as any).progressNoteTemplates : null,
    }),
  }),
  graphql(screeningToolsGraphql, {
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningTools : null,
    }),
  }),
  graphql(computedFieldsGraphql, {
    props: ({ data }) => ({
      computedFieldsLoading: data ? data.loading : false,
      computedFieldsError: data ? data.error : null,
      computedFields: data ? (data as any).computedFields : null,
    }),
  }),
)(BuilderQuestions) as React.ComponentClass<IProps>;
