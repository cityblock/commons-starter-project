import * as classNames from 'classnames';
import { keys, values } from 'lodash';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
import * as screeningToolQuestionsQuery from '../graphql/queries/get-questions.graphql';
import * as screeningToolQuery from '../graphql/queries/get-screening-tool.graphql';
import * as patientAnswersCreate from '../graphql/queries/patient-answers-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  patientAnswersCreateMutationVariables,
  FullPatientAnswerFragment,
  FullPatientScreeningToolSubmissionFragment,
  FullQuestionFragment,
  FullScreeningToolFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import { Popup } from '../shared/popup/popup';
import * as styles from './css/risk-areas.css';
import { PatientScreeningToolSubmission } from './patient-screening-tool-submission';
import ScreeningToolQuestion from './screening-tool-question';
import ScreeningToolResultsPopup from './screening-tool-results-popup';

interface IProps {
  screeningToolId: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
  redirectToScreeningTools?: () => any;
  screeningTool?: FullScreeningToolFragment;
  loading?: boolean;
  error?: string;
  screeningToolQuestions?: FullQuestionFragment[];
  screeningToolQuestionsLoading?: boolean;
  screeningToolQuestionsError?: string;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: { patientAnswersCreate: [FullPatientAnswerFragment] } };
  refetchScreeningTool?: () => any;
  refetchScreeningToolQuestions?: () => any;
  previousPatientScreeningToolSubmissionLoading?: boolean;
  previousPatientScreeningToolSubmissionError?: string;
  previousPatientScreeningToolSubmission?: FullPatientScreeningToolSubmissionFragment;
}

export interface IQuestionsState {
  [questionId: string]: {
    answers: Array<{
      id: string;
      value: string;
    }>;
  };
}

interface IState {
  questions: IQuestionsState;
  screeningToolLoading: boolean;
  screeningToolError?: string;
  patientScreeningToolSubmissionId?: string;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class ScreeningTool extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.evaluateQuestionConditions = this.evaluateQuestionConditions.bind(this);
    this.getQuestionVisibility = this.getQuestionVisibility.bind(this);
    this.renderScreeningToolQuestion = this.renderScreeningToolQuestion.bind(this);
    this.renderScreeningToolQuestions = this.renderScreeningToolQuestions.bind(this);
    this.updateMultiSelectAnswer = this.updateMultiSelectAnswer.bind(this);
    this.updateAnswer = this.updateAnswer.bind(this);
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

  componentWillReceiveProps(nextProps: IProps) {
    const { screeningToolQuestions } = nextProps;
    const { questions } = this.state;

    // ScreeningTool Questions have loaded
    if (screeningToolQuestions && !this.props.screeningToolQuestions) {
      screeningToolQuestions.forEach(question => {
        if (!questions[question.id]) {
          questions[question.id] = { answers: [] };
        }
      });

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
    const { createPatientAnswers, patientId, screeningToolQuestions, screeningToolId } = this.props;
    const { questions } = this.state;
    const questionIds = keys(questions);

    if (createPatientAnswers && this.allQuestionsAnswered()) {
      this.setState(() => ({ screeningToolLoading: true, screeningToolError: undefined }));

      const patientAnswers = questionIds
        .map(questionId => questions[questionId].answers.map(answer => ({ ...answer, questionId })))
        .reduce((answers1, answers2) => answers1.concat(answers2))
        .map(answer => {
          const question = (screeningToolQuestions || []).find(q => q.id === answer.questionId);
          return {
            patientId,
            questionId: answer.questionId,
            applicable: this.getQuestionVisibility(question),
            answerId: answer.id,
            answerValue: answer.value,
          };
        });

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
          resetQuestions[questionId] = { answers: [] };
        });

        const { data } = results;
        const firstCreatedAnswer = data.patientAnswersCreate[0];

        this.setState(() => ({
          screeningToolLoading: false,
          screeningToolError: undefined,
          questions: resetQuestions,
          patientScreeningToolSubmissionId: firstCreatedAnswer.patientScreeningToolSubmissionId,
        }));
      } catch (err) {
        this.setState(() => ({ screeningToolLoading: false, screeningToolError: err.message }));
      }
    }
  }

  updateMultiSelectAnswer(questionId: string, answerId: string, value: string | number) {
    const { questions } = this.state;
    const questionData = questions[questionId];

    const answerIndex = questionData.answers.findIndex((answer: any) => answer.id === answerId);

    if (answerIndex > -1) {
      questionData.answers.splice(answerIndex, 1);
    } else {
      (questionData as any).answers.push({ id: answerId, value });
    }

    this.setState(() => ({
      questions: { ...questions, [questionId]: questionData },
    }));
  }

  updateAnswer(questionId: string, answerId: string, value: string | number) {
    const { questions } = this.state;
    const questionData = questions[questionId];

    (questionData as any).answers = [{ id: answerId, value }];

    this.setState(() => ({
      questions: { ...questions, [questionId]: questionData },
    }));
  }

  onChange(questionId: string, answerId: string, value: string | number) {
    const { screeningToolQuestions } = this.props;
    const fetchedQuestion = (screeningToolQuestions || []).find(
      question => question.id === questionId,
    );

    if (fetchedQuestion && fetchedQuestion.answerType === 'multiselect') {
      this.updateMultiSelectAnswer(questionId, answerId, value);
    } else if (fetchedQuestion) {
      this.updateAnswer(questionId, answerId, value);
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

  getQuestionVisibility(question?: FullQuestionFragment): boolean {
    if (!question) {
      return false;
    }

    let visible: boolean = true;

    const questionConditions = question.applicableIfQuestionConditions;

    if (questionConditions && questionConditions.length) {
      const conditionsMet = this.evaluateQuestionConditions(questionConditions);

      const allTrue = conditionsMet.satisfied === conditionsMet.total;
      const oneTrue = conditionsMet.satisfied > 0;

      switch (question.applicableIfType) {
        case 'allTrue': {
          if (!allTrue) {
            visible = false;
            break;
          }
        }
        case 'oneTrue': {
          if (!oneTrue) {
            visible = false;
            break;
          }
        }
        default: {
          visible = true;
          break;
        }
      }
    }

    return visible;
  }

  renderScreeningToolQuestion(question: FullQuestionFragment, index: number) {
    const { questions } = this.state;

    const visible = this.getQuestionVisibility(question);

    return (
      <ScreeningToolQuestion
        visible={visible}
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

  render() {
    const { screeningTool, patientRoute } = this.props;
    const { patientScreeningToolSubmissionId } = this.state;
    const title = screeningTool ? screeningTool.title : 'Loading...';

    const submitButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.disabled]: !this.allQuestionsAnswered(),
    });
    const titleStyles = classNames(styles.riskAssessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    const assessmentHtml = this.isError() ? (
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

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={submitButtonStyles} onClick={this.onSubmit}>
            Submit
          </div>
        </div>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={!!patientScreeningToolSubmissionId} smallPadding={true}>
          <ScreeningToolResultsPopup
            patientRoute={patientRoute}
            patientScreeningToolSubmissionId={patientScreeningToolSubmissionId}
          />
        </Popup>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToScreeningTools: () => {
      dispatch(push(ownProps.routeBase));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(screeningToolQuery as any, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'screeningTool',
        filterId: props.screeningToolId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      screeningTool: data ? (data as any).screeningTool : null,
      refetchScreeningTool: data ? data.refetch : null,
    }),
  }),
  graphql(screeningToolQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.screeningToolId,
      },
    }),
    props: ({ data }) => ({
      screeningToolQuestionsLoading: data ? data.loading : false,
      screeningToolQuestionsError: data ? data.error : null,
      screeningToolQuestions: data ? (data as any).questions : null,
      refetchScreeningToolQuestions: data ? data.refetch : null,
    }),
  }),
  graphql(patientAnswersCreate as any, { name: 'createPatientAnswers' }),
  graphql(patientScreeningToolSubmissionQuery as any, {
    skip: (props: IProps) => !props.screeningToolId,
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.screeningToolId,
        patientId: props.patientId,
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
