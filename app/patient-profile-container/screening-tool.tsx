import * as classNames from 'classnames';
import { keys, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
import * as screeningToolQuestionsQuery from '../graphql/queries/get-questions.graphql';
import * as screeningToolQuery from '../graphql/queries/get-screening-tool.graphql';
import * as patientAnswersCreate from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  FullPatientScreeningToolSubmissionFragment,
  FullQuestionFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import { Popup } from '../shared/popup/popup';
import PatientQuestion from '../shared/question/patient-question';
import {
  getNewPatientAnswers,
  getQuestionVisibility,
  getUpdateForAnswer,
  setupQuestionsState,
  IQuestionsState,
} from '../shared/question/question-helpers';
import * as styles from './css/risk-areas.css';
import { PatientScreeningToolSubmission } from './patient-screening-tool-submission';
import ScreeningToolResultsPopup from './screening-tool-results-popup';

interface IProps {
  match: {
    params: {
      patientId: string;
      screeningToolId: string;
    };
  };
}

interface IGraphqlProps {
  screeningTool?: FullScreeningToolFragment;
  loading?: boolean;
  error?: string;
  screeningToolQuestions?: FullQuestionFragment[];
  screeningToolQuestionsLoading?: boolean;
  screeningToolQuestionsError?: string;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
  refetchScreeningTool?: () => any;
  refetchScreeningToolQuestions?: () => any;
  previousPatientScreeningToolSubmissionLoading?: boolean;
  previousPatientScreeningToolSubmissionError?: string;
  previousPatientScreeningToolSubmission?: FullPatientScreeningToolSubmissionFragment;
}

interface IState {
  questions: IQuestionsState;
  screeningToolLoading: boolean;
  screeningToolError?: string;
  patientScreeningToolSubmissionId?: string;
}

type allProps = IGraphqlProps & IProps;

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class ScreeningTool extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.evaluateQuestionConditions = this.evaluateQuestionConditions.bind(this);
    this.renderScreeningToolQuestion = this.renderScreeningToolQuestion.bind(this);
    this.renderScreeningToolQuestions = this.renderScreeningToolQuestions.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isError = this.isError.bind(this);
    this.isLoadingOrError = this.isLoadingOrError.bind(this);
    this.onRetryLoad = this.onRetryLoad.bind(this);
    this.allQuestionsAnswered = this.allQuestionsAnswered.bind(this);
    this.renderPreviousPatientScreeningToolSubmission = this.renderPreviousPatientScreeningToolSubmission.bind(
      this,
    );

    this.state = {
      questions: {},
      screeningToolLoading: false,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    // ScreeningTool Questions have loaded
    if (nextProps.screeningToolQuestions && !this.props.screeningToolQuestions) {
      const questions = setupQuestionsState(
        this.state.questions,
        this.props.screeningToolQuestions,
        nextProps.screeningToolQuestions,
      );

      this.setState(() => ({ questions }));
    }
  }

  isLoading() {
    const { loading, screeningToolQuestionsLoading } = this.props;

    return loading || screeningToolQuestionsLoading;
  }

  isError() {
    const { error, screeningToolQuestionsError } = this.props;

    return !!error || !!screeningToolQuestionsError;
  }

  isLoadingOrError() {
    return this.isError() || this.isLoading();
  }

  allQuestionsAnswered() {
    const { screeningToolQuestions } = this.props;
    const { questions } = this.state;

    if (!screeningToolQuestions) {
      return false;
    }

    return screeningToolQuestions.every(question => {
      const questionData = questions[question.id];

      return !!questionData && !!questionData.answers.length;
    });
  }

  async onSubmit() {
    const { createPatientAnswers, screeningToolQuestions, match } = this.props;
    const patientId = match.params.patientId;
    const screeningToolId = match.params.screeningToolId;
    const { questions } = this.state;
    const questionIds = keys(questions);

    if (createPatientAnswers && this.allQuestionsAnswered()) {
      this.setState(() => ({ screeningToolLoading: true, screeningToolError: undefined }));

      const patientAnswers = getNewPatientAnswers(
        patientId,
        questions,
        screeningToolQuestions || [],
      );

      try {
        const results = await createPatientAnswers({
          variables: {
            patientId,
            patientAnswers,
            questionIds,
            screeningToolId,
          },
        });

        const resetQuestions: IQuestionsState = {};

        questionIds.forEach(questionId => {
          resetQuestions[questionId] = { answers: [], oldAnswers: [], changed: false };
        });

        const { data } = results;
        const firstCreatedAnswer = data.patientAnswersCreate ? data.patientAnswersCreate[0] : null;
        if (firstCreatedAnswer) {
          this.setState(() => ({
            screeningToolLoading: false,
            screeningToolError: undefined,
            questions: resetQuestions,
            patientScreeningToolSubmissionId: firstCreatedAnswer.patientScreeningToolSubmissionId,
          }));
        }
      } catch (err) {
        this.setState(() => ({ screeningToolLoading: false, screeningToolError: err.message }));
      }
    }
  }

  onChange(questionId: string, answerId: string, value: string | number) {
    const { screeningToolQuestions } = this.props;

    const update = getUpdateForAnswer(
      questionId,
      answerId,
      value,
      screeningToolQuestions || [],
      this.state.questions,
    );
    if (update) {
      this.setState({
        questions: update,
      });
    }
  }

  evaluateQuestionConditions(questionConditions: IQuestionCondition[]) {
    const { questions } = this.state;

    const questionAnswers = values(questions).map(questionValue => questionValue.answers);

    const conditionsStatus = {
      total: questionConditions.length,
      satisfied: 0,
    };

    if (questionAnswers.length) {
      const flattenedAnswers = questionAnswers.reduce((answers1, answers2) =>
        answers1.concat(answers2),
      );

      questionConditions.forEach(condition => {
        if (flattenedAnswers.some(answer => answer.id === condition.answerId)) {
          conditionsStatus.satisfied += 1;
        }
      });
    }

    return conditionsStatus;
  }

  renderScreeningToolQuestion(question: FullQuestionFragment, index: number) {
    const { questions } = this.state;

    const visible = getQuestionVisibility(question, questions);

    return (
      <PatientQuestion
        editable={true}
        visible={visible}
        displayHamburger={true}
        answerData={questions[question.id]}
        onChange={this.onChange}
        key={`${question.id}-${index}`}
        question={question}
      />
    );
  }

  renderScreeningToolQuestions() {
    const { screeningToolQuestions } = this.props;

    return (screeningToolQuestions || []).map(this.renderScreeningToolQuestion);
  }

  onRetryLoad() {
    const { refetchScreeningTool, refetchScreeningToolQuestions } = this.props;

    // TODO: What to do if there is a serious error and these fuctions don't exist?

    if (refetchScreeningTool) {
      refetchScreeningTool();
    }

    if (refetchScreeningToolQuestions) {
      refetchScreeningToolQuestions();
    }
  }

  renderPreviousPatientScreeningToolSubmission() {
    const {
      previousPatientScreeningToolSubmission,
      previousPatientScreeningToolSubmissionLoading,
      previousPatientScreeningToolSubmissionError,
    } = this.props;

    return (
      <PatientScreeningToolSubmission
        submission={previousPatientScreeningToolSubmission}
        loading={previousPatientScreeningToolSubmissionLoading}
        error={previousPatientScreeningToolSubmissionError}
      />
    );
  }

  getAssessmentHtml() {
    const { screeningTool } = this.props;
    const title = screeningTool ? screeningTool.title : 'Loading...';
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
            <div className={styles.riskAssessmentErrorMessageLabel}>Error loading tool.</div>
            <div className={styles.riskAssessmentErrorMessageCta} onClick={this.onRetryLoad}>
              <div className={styles.riskAssessmentErrorMessageLink}>Click here to retry.</div>
              <div className={styles.riskAssessmentErrorMessageIcon} />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.riskAssessment}>
        {this.renderPreviousPatientScreeningToolSubmission()}
        <div className={titleStyles}>
          <div className={styles.title}>
            <div className={styles.titleIcon} />
            <div className={styles.titleText}>{title}</div>
          </div>
          <div className={styles.meta}>
            <div className={styles.lastUpdatedLabel}>Last updated:</div>
            <div className={styles.lastUpdatedValue}>TBD!</div>
          </div>
        </div>
        {this.renderScreeningToolQuestions()}
      </div>
    );
  }

  render() {
    const { match } = this.props;
    const patientRoute = `/patients/${match.params.patientId}`;
    const { patientScreeningToolSubmissionId } = this.state;

    const submitButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.disabled]: !this.allQuestionsAnswered(),
    });

    const assessmentHtml = this.getAssessmentHtml();

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={submitButtonStyles} onClick={this.onSubmit}>
            Submit
          </div>
        </div>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={!!patientScreeningToolSubmissionId} style={'small-padding'}>
          <ScreeningToolResultsPopup
            patientRoute={patientRoute}
            patientScreeningToolSubmissionId={patientScreeningToolSubmissionId}
          />
        </Popup>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(screeningToolQuery as any, {
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.match.params.screeningToolId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      screeningTool: data ? (data as any).screeningTool : null,
      refetchScreeningTool: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(screeningToolQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'screeningTool',
        filterId: props.match.params.screeningToolId,
      },
    }),
    props: ({ data }) => ({
      screeningToolQuestionsLoading: data ? data.loading : false,
      screeningToolQuestionsError: data ? data.error : null,
      screeningToolQuestions: data ? (data as any).questions : null,
      refetchScreeningToolQuestions: data ? data.refetch : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(patientAnswersCreate as any, { name: 'createPatientAnswers' }),
  graphql<IGraphqlProps, IProps>(patientScreeningToolSubmissionQuery as any, {
    skip: (props: IProps) => !props.match.params.screeningToolId,
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.match.params.screeningToolId,
        patientId: props.match.params.patientId,
      },
    }),
    props: ({ data }) => ({
      previousPatientScreeningToolSubmissionLoading: data ? data.loading : false,
      previousPatientScreeningToolSubmissionError: data ? data.error : null,
      previousPatientScreeningToolSubmission: data
        ? (data as any).patientScreeningToolSubmissionForPatientAndScreeningTool
        : null,
    }),
  }),
)(ScreeningTool);
