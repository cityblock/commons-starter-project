import * as classNames from 'classnames';
import { clone, keys } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as patientAnswersQuery from '../graphql/queries/get-patient-answers.graphql';
/* tslint:disable:max-line-length */
import * as riskAreaQuestionsQuery from '../graphql/queries/get-questions.graphql';
import * as riskAreaQuery from '../graphql/queries/get-risk-area.graphql';
import * as screeningToolsQuery from '../graphql/queries/get-screening-tools-for-risk-area.graphql';
import * as patientAnswersCreateMutationGraphql from '../graphql/queries/patient-answers-create-mutation.graphql';
import * as patientAnswersUpdateApplicabilityMutationGraphql from '../graphql/queries/patient-answers-update-applicable-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  patientAnswersUpdateApplicableMutation,
  patientAnswersUpdateApplicableMutationVariables,
  FullPatientAnswerFragment,
  FullQuestionFragment,
  FullRiskAreaFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import { Popup } from '../shared/popup/popup';
import PatientQuestion from '../shared/question/patient-question';
import {
  getLastUpdated,
  getNewPatientAnswers,
  getQuestionVisibility,
  getUpdateForAnswer,
  setupQuestionsState,
  updateQuestionAnswersState,
  IQuestionsState,
} from '../shared/question/question-helpers';
import * as styles from './css/risk-areas.css';
import ScreeningToolsPopup from './screening-tool/screening-tools-popup';

interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
}

interface IDispatchProps {
  redirectToThreeSixty?: () => any;
  redirectToScreeningTool?: (screeningTool: FullScreeningToolFragment) => any;
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string;
  riskAreaQuestions?: FullQuestionFragment[];
  riskAreaQuestionsLoading?: boolean;
  riskAreaQuestionsError?: string;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
  updateAnswersApplicability?: (
    options: { variables: patientAnswersUpdateApplicableMutationVariables },
  ) => { data: patientAnswersUpdateApplicableMutation };
  patientAnswers?: [FullPatientAnswerFragment];
  patientAnswersLoading?: boolean;
  patientAnswersError?: string;
  refetchRiskArea?: () => any;
  refetchRiskAreaQuestions?: () => any;
  refetchPatientAnswers?: () => any;
  screeningTools?: FullScreeningToolFragment[];
  screeningToolsLoading?: boolean;
  screeningToolsError?: string;
}

type allProps = IGraphqlProps & IProps & IDispatchProps;

interface IState {
  inProgress: boolean;
  questions: IQuestionsState;
  assessmentLoading: boolean;
  assessmentError?: string;
  updateAnswersApplicabilityLoading: boolean;
  updateAnswersApplicabilityError?: string;
  selectingScreeningTool: boolean;
  currentlyAdministeringScreeningTool?: FullScreeningToolFragment;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class RiskAreaAssessment extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      inProgress: false,
      questions: {},
      assessmentLoading: false,
      updateAnswersApplicabilityLoading: false,
      selectingScreeningTool: false,
      currentlyAdministeringScreeningTool: undefined,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { error, redirectToThreeSixty } = nextProps;

    // The chosen RiskArea most likely does not exist
    if (error && redirectToThreeSixty) {
      redirectToThreeSixty();
    }

    const questions = setupQuestionsState(
      this.state.questions,
      this.props.riskAreaQuestions,
      nextProps.riskAreaQuestions,
    );

    updateQuestionAnswersState(
      this.state.questions,
      nextProps.patientAnswers || [],
      this.props.patientAnswers,
    );
    this.setState({ questions });
  }

  isLoading = () => {
    const { loading, riskAreaQuestionsLoading, patientAnswersLoading } = this.props;

    return loading || riskAreaQuestionsLoading || patientAnswersLoading;
  };

  isError = () => {
    const { error, riskAreaQuestionsError, patientAnswersError } = this.props;

    return !!error || !!riskAreaQuestionsError || !!patientAnswersError;
  };

  isLoadingOrError = () => this.isError() || this.isLoading();

  onStart = () => {
    if (!this.isLoadingOrError()) {
      this.setState({ inProgress: true });
    }
  };

  onCancel = () => {
    const { questions } = this.state;

    keys(questions).forEach(questionId => {
      if (questions[questionId].changed) {
        questions[questionId].changed = false;
        questions[questionId].answers = questions[questionId].oldAnswers;
      }
    });

    this.setState({ inProgress: false, questions });
  };

  updateVisibility = (updatedAnswersResponse: { data: patientAnswersUpdateApplicableMutation }) => {
    const { data } = updatedAnswersResponse;

    // TODO: use the response here to verify the visibility of answers in the assessment
    if (data && data.patientAnswersUpdateApplicable) {
      return data;
    }
  };

  /**
   * TODO: evaluate moving to helper
   */
  async updateAnswersApplicability() {
    const { updateAnswersApplicability, patientId, riskAreaId } = this.props;

    if (updateAnswersApplicability) {
      try {
        this.setState({
          updateAnswersApplicabilityLoading: true,
          updateAnswersApplicabilityError: undefined,
        });

        const result = await updateAnswersApplicability({ variables: { patientId, riskAreaId } });

        this.updateVisibility(result);

        this.setState({
          updateAnswersApplicabilityLoading: false,
          updateAnswersApplicabilityError: undefined,
        });
      } catch (err) {
        this.setState({
          updateAnswersApplicabilityLoading: false,
          updateAnswersApplicabilityError: err.message,
        });
      }
    }
  }

  getChangedQuestionIds = () => {
    const { questions } = this.state;
    const questionIds = keys(questions);

    return questionIds.filter(
      questionId => !!questions[questionId] && questions[questionId].changed,
    );
  };

  onSave = async () => {
    const { createPatientAnswers, patientId, riskAreaQuestions } = this.props;
    const { questions } = this.state;
    const questionIds = keys(questions);
    const changedQuestionIds = this.getChangedQuestionIds();

    if (createPatientAnswers && changedQuestionIds.length) {
      this.setState({ assessmentLoading: true, assessmentError: undefined });

      const newPatientAnswers = getNewPatientAnswers(patientId, questions, riskAreaQuestions || []);

      try {
        await createPatientAnswers({
          variables: {
            patientId,
            patientAnswers: newPatientAnswers,
            questionIds: changedQuestionIds,
          },
        });

        /**
         * TODO: evaluate moving to helper
         */
        const resetQuestions: IQuestionsState = {};

        questionIds.forEach(questionId => {
          const answers = questions[questionId].answers;

          resetQuestions[questionId] = {
            answers,
            oldAnswers: clone(answers),
            changed: false,
          };
        });

        this.setState({
          assessmentLoading: false,
          assessmentError: undefined,
          inProgress: false,
          questions: resetQuestions,
        });

        this.updateAnswersApplicability();
      } catch (err) {
        this.setState({ assessmentLoading: false, assessmentError: err.message });
      }
    }
  };

  onChange = (questionId: string, answers: Array<{ answerId: string; value: string | number }>) => {
    const { riskAreaQuestions } = this.props;

    answers.map(answer => {
      const update = getUpdateForAnswer(
        questionId,
        answer.answerId,
        answer.value,
        riskAreaQuestions || [],
        this.state.questions,
      );
      if (update) {
        this.setState({ questions: update });
      }
    });
  };

  renderRiskAreaQuestion = (question: FullQuestionFragment, index: number) => {
    const { questions, inProgress } = this.state;

    const visible = getQuestionVisibility(question, questions);

    return (
      <PatientQuestion
        visible={visible}
        displayHamburger={true}
        answerData={questions[question.id]}
        onChange={this.onChange}
        key={`${question.id}-${index}`}
        question={question}
        editable={inProgress}
      />
    );
  };

  renderRiskAreaQuestions = () => {
    const { riskAreaQuestions } = this.props;

    return (riskAreaQuestions || []).map(this.renderRiskAreaQuestion);
  };

  onRetryLoad = () => {
    const { refetchRiskArea, refetchRiskAreaQuestions, refetchPatientAnswers } = this.props;

    // TODO: What to do if there is a serious error and these fuctions don't exist?

    if (refetchRiskArea) {
      refetchRiskArea();
    }

    if (refetchRiskAreaQuestions) {
      refetchRiskAreaQuestions();
    }

    if (refetchPatientAnswers) {
      refetchPatientAnswers();
    }
  };

  onClickToSelectScreeningTool = () => {
    this.setState({ selectingScreeningTool: true });
  };

  onDismissScreeningToolSelect = () => {
    this.setState({ selectingScreeningTool: false });
  };

  onSelectScreeningTool = (screeningTool: FullScreeningToolFragment) => {
    const { redirectToScreeningTool } = this.props;
    this.setState({
      selectingScreeningTool: false,
      currentlyAdministeringScreeningTool: screeningTool,
    });

    if (redirectToScreeningTool) {
      redirectToScreeningTool(screeningTool);
    }
  };

  getAssessmentHtml = () => {
    const { riskArea, patientAnswers, patientAnswersError, patientAnswersLoading } = this.props;

    const lastUpdated = getLastUpdated(
      patientAnswers || [],
      patientAnswersLoading,
      patientAnswersError,
    );
    const title = riskArea ? riskArea.title : 'Loading...';

    const titleStyles = classNames(styles.riskAssessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    return this.isError() ? (
      <div className={styles.riskAssessmentError}>
        <div className={styles.riskAssessmentErrorMessage}>
          <div className={styles.riskAssessmentErrorIcon} />
          <div className={styles.riskAssessmentErrorMessageText}>
            <div className={styles.riskAssessmentErrorMessageLabel}>Error loading assessment.</div>
            <div className={styles.riskAssessmentErrorMessageCta} onClick={this.onRetryLoad}>
              <div className={styles.riskAssessmentErrorMessageLink}>Click here to retry.</div>
              <div className={styles.riskAssessmentErrorMessageIcon} />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.riskAssessment}>
        <div className={titleStyles}>
          <div className={styles.title}>
            <div className={styles.titleIcon} />
            <div className={styles.titleText}>{title}</div>
          </div>
          <div className={styles.meta}>
            <div className={styles.lastUpdatedLabel}>Last updated:</div>
            <div className={styles.lastUpdatedValue}>{lastUpdated}</div>
          </div>
        </div>
        {this.renderRiskAreaQuestions()}
      </div>
    );
  };

  render() {
    const { screeningTools } = this.props;
    const { inProgress, selectingScreeningTool } = this.state;

    const toolsButtonStyles = classNames(styles.invertedButton, styles.toolsButton, {
      [styles.hidden]: inProgress,
    });
    const cancelButtonStyles = classNames(styles.invertedButton, styles.cancelButton, {
      [styles.hidden]: !inProgress,
    });
    const saveButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.hidden]: !inProgress,
      [styles.disabled]: !this.getChangedQuestionIds().length,
    });
    const startButtonStyles = classNames(styles.button, styles.startButton, {
      [styles.hidden]: inProgress,
      [styles.disabled]: this.isLoadingOrError(),
    });
    const assessmentHtml = this.getAssessmentHtml();
    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={cancelButtonStyles} onClick={this.onCancel}>
            Cancel
          </div>
          <div className={toolsButtonStyles} onClick={this.onClickToSelectScreeningTool}>
            Administer tool
          </div>
          <div className={saveButtonStyles} onClick={this.onSave}>
            Save updates
          </div>
          <div className={startButtonStyles} onClick={this.onStart}>
            Start assessment
          </div>
        </div>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={selectingScreeningTool} style={'small-padding'}>
          <ScreeningToolsPopup
            screeningTools={screeningTools}
            onDismiss={this.onDismissScreeningToolSelect}
            onSelectScreeningTool={this.onSelectScreeningTool}
          />
        </Popup>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToThreeSixty: () => {
      dispatch(push(ownProps.routeBase));
    },
    redirectToScreeningTool: (screeningTool: FullScreeningToolFragment) => {
      dispatch(push(`${ownProps.patientRoute}/tools/${screeningTool.id}`));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, IProps>(undefined, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      riskArea: data ? (data as any).riskArea : null,
      refetchRiskArea: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'riskArea',
        filterId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      riskAreaQuestionsLoading: data ? data.loading : false,
      riskAreaQuestionsError: data ? data.error : null,
      riskAreaQuestions: data ? (data as any).questions : null,
      refetchRiskAreaQuestions: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'riskArea',
        filterId: props.riskAreaId,
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
      refetchPatientAnswers: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      screeningToolsLoading: data ? data.loading : false,
      screeningToolsError: data ? data.error : null,
      screeningTools: data ? (data as any).screeningToolsForRiskArea : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreateMutationGraphql as any, {
    name: 'createPatientAnswers',
  }),
  graphql<IGraphqlProps, IProps, allProps>(
    patientAnswersUpdateApplicabilityMutationGraphql as any,
    {
      name: 'updateAnswersApplicability',
    },
  ),
)(RiskAreaAssessment);
