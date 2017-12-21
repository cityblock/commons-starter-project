import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientAnswersQuery from '../../graphql/queries/get-patient-answers.graphql';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
import * as screeningToolQuestionsQuery from '../../graphql/queries/get-questions.graphql';
import * as screeningToolQuery from '../../graphql/queries/get-screening-tool.graphql';
import * as patientAnswersCreate from '../../graphql/queries/patient-answers-create-mutation.graphql';
import * as patientScreeningToolSubmissionCreate from '../../graphql/queries/patient-screening-tool-submission-create.graphql';
import * as patientScreeningToolSubmissionScore from '../../graphql/queries/patient-screening-tool-submission-score.graphql';
/* tsline:enable:max-line-length */
import {
  getPatientAnswersQuery,
  patientAnswersCreateMutation,
  patientAnswersCreateMutationVariables,
  patientScreeningToolSubmissionCreateMutation,
  patientScreeningToolSubmissionCreateMutationVariables,
  patientScreeningToolSubmissionScoreMutation,
  patientScreeningToolSubmissionScoreMutationVariables,
  FullPatientScreeningToolSubmissionFragment,
  FullQuestionFragment,
  FullScreeningToolFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../../shared/css/sort-search.css';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import { Popup } from '../../shared/popup/popup';
import PatientQuestion from '../../shared/question/patient-question';
import {
  allQuestionsAnswered,
  getQuestionVisibility,
  setupQuestionAnswerHash,
  updateQuestionAnswerHash,
  IQuestionAnswerHash,
} from '../../shared/question/question-helpers';
import * as styles from './css/screening-tool.css';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
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
  error: string | null;
  screeningToolQuestions?: FullQuestionFragment[];
  screeningToolQuestionsLoading?: boolean;
  screeningToolQuestionsError: string | null;
  createPatientAnswers?: (
    options: { variables: patientAnswersCreateMutationVariables },
  ) => { data: patientAnswersCreateMutation };
  createScreeningToolSubmission?: (
    options: { variables: patientScreeningToolSubmissionCreateMutationVariables },
  ) => { data: patientScreeningToolSubmissionCreateMutation };
  scoreScreeningToolSubmission?: (
    options: { variables: patientScreeningToolSubmissionScoreMutationVariables },
  ) => { data: patientScreeningToolSubmissionScoreMutation };
  patientScreeningToolSubmissionLoading?: boolean;
  patientScreeningToolSubmissionError: string | null;
  patientScreeningToolSubmission?: FullPatientScreeningToolSubmissionFragment;
  patientAnswers?: getPatientAnswersQuery['patientAnswers'];
  patientAnswersLoading?: boolean;
  patientAnswersError: string | null;
}

type allProps = IGraphqlProps & IProps;

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

export class ScreeningTool extends React.Component<allProps> {
  async componentWillReceiveProps(newProps: allProps) {
    if (
      newProps.createScreeningToolSubmission &&
      !newProps.patientScreeningToolSubmission &&
      !newProps.patientScreeningToolSubmissionLoading
    ) {
      await newProps.createScreeningToolSubmission({
        variables: {
          screeningToolId: newProps.match.params.screeningToolId,
          patientId: newProps.match.params.patientId,
        },
      });
    }
  }

  isLoading = () => {
    const { loading, screeningToolQuestionsLoading } = this.props;

    return loading || screeningToolQuestionsLoading;
  };

  isError = () => {
    const { error, screeningToolQuestionsError } = this.props;

    return !!error || !!screeningToolQuestionsError;
  };

  isLoadingOrError = () => {
    return this.isError() || this.isLoading();
  };

  onSubmit = async () => {
    const { scoreScreeningToolSubmission, patientScreeningToolSubmission } = this.props;

    const questionsAnswered = this.allQuestionsAnswered();

    if (patientScreeningToolSubmission && scoreScreeningToolSubmission && questionsAnswered) {
      await scoreScreeningToolSubmission({
        variables: {
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
        },
      });
    }
  };

  onChange = (questionId: string, answers: Array<{ answerId: string; value: string | number }>) => {
    const { patientScreeningToolSubmission, createPatientAnswers } = this.props;
    if (patientScreeningToolSubmission && createPatientAnswers) {
      const patientId = this.props.match.params.patientId;
      const patientAnswers = answers.map(answer => ({
        questionId,
        answerId: answer.answerId,
        answerValue: String(answer.value),
        patientId,
        applicable: true,
      }));

      createPatientAnswers({
        variables: {
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
          patientId: this.props.match.params.patientId,
          patientAnswers,
          questionIds: [questionId],
        },
      });
    }
  };

  renderScreeningToolQuestion = (
    question: FullQuestionFragment,
    index: number,
    answerData: IQuestionAnswerHash,
  ) => {
    const visible = getQuestionVisibility(question, answerData);
    const dataForQuestion = answerData[question.id] || [];
    return (
      <PatientQuestion
        editable={true}
        visible={visible}
        displayHamburger={false}
        answerData={dataForQuestion}
        onChange={this.onChange}
        key={`${question.id}-${index}`}
        question={question}
      />
    );
  };

  renderScreeningToolQuestions = () => {
    const { screeningToolQuestions, patientAnswers } = this.props;

    const answerData = setupQuestionAnswerHash({}, screeningToolQuestions);
    updateQuestionAnswerHash(answerData, patientAnswers || []);

    return (screeningToolQuestions || []).map((question, index) =>
      this.renderScreeningToolQuestion(question, index, answerData),
    );
  };

  getAssessmentHtml() {
    const { screeningTool } = this.props;
    const title = screeningTool ? screeningTool.title : 'Loading...';
    const titleStyles = classNames(styles.assessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    return this.isError() ? (
      <div className={styles.error}>
        <div className={styles.errorMessage}>
          <Icon name="addAlert" />
          <div className={styles.errorMessageText}>
            <div className={styles.errorMessageLabel}>Error loading tool.</div>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.assessment}>
        <PatientScreeningToolSubmission
          patientId={this.props.match.params.patientId}
          screeningToolId={this.props.match.params.screeningToolId}
        />
        <div className={titleStyles}>
          <div className={styles.title}>
            <Icon name="event" />
            <div className={styles.titleText}>{title}</div>
          </div>
          <div className={styles.meta}>
            <div className={styles.lastUpdatedLabel}>Last updated:</div>
            <div className={styles.lastUpdatedValue}>TODO</div>
          </div>
        </div>
        {this.renderScreeningToolQuestions()}
      </div>
    );
  }

  allQuestionsAnswered() {
    const { screeningToolQuestions, patientAnswers } = this.props;

    const answerData = setupQuestionAnswerHash({}, screeningToolQuestions);
    updateQuestionAnswerHash(answerData, patientAnswers || []);
    return allQuestionsAnswered(screeningToolQuestions || [], answerData);
  }

  render() {
    const { match } = this.props;
    const patientRoute = `/patients/${match.params.patientId}`;
    const { patientScreeningToolSubmission } = this.props;
    const patientScreeningToolSubmissionId = patientScreeningToolSubmission
      ? patientScreeningToolSubmission.id
      : null;

    const submitButtonStyles = classNames({
      [styles.disabled]: !this.allQuestionsAnswered(),
    });

    const assessmentHtml = this.getAssessmentHtml();
    const popupVisible =
      patientScreeningToolSubmission && patientScreeningToolSubmission.scoredAt ? true : false;
    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <Button
            messageId="screeningTool.submit"
            className={submitButtonStyles}
            onClick={this.onSubmit}
          />
        </div>
        <div className={styles.panel}>{assessmentHtml}</div>
        <Popup visible={popupVisible} style={'small-padding'}>
          <ScreeningToolResultsPopup
            patientRoute={patientRoute}
            patientScreeningToolSubmissionId={patientScreeningToolSubmissionId}
          />
        </Popup>
      </div>
    );
  }
}

const getPatientScreeningToolSubmissionId = (props: allProps) => {
  const { patientScreeningToolSubmission } = props;
  return patientScreeningToolSubmission ? patientScreeningToolSubmission.id : null;
};

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersCreate as any, {
    name: 'createPatientAnswers',
    options: { refetchQueries: ['getPatientAnswers'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientScreeningToolSubmissionCreate as any, {
    name: 'createScreeningToolSubmission',
    options: { refetchQueries: ['getPatientScreeningToolSubmissionForPatientAndScreeningTool'] },
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientScreeningToolSubmissionScore as any, {
    name: 'scoreScreeningToolSubmission',
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolQuery as any, {
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.match.params.screeningToolId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      screeningTool: data ? (data as any).screeningTool : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(screeningToolQuestionsQuery as any, {
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
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientScreeningToolSubmissionQuery as any, {
    skip: (props: IProps) => !props.match.params.screeningToolId,
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.match.params.screeningToolId,
        patientId: props.match.params.patientId,
        scored: false,
      },
    }),
    props: ({ data }) => ({
      patientScreeningToolSubmissionLoading: data ? data.loading : false,
      patientScreeningToolSubmissionError: data ? data.error : null,
      patientScreeningToolSubmission: data
        ? (data as any).patientScreeningToolSubmissionForPatientAndScreeningTool
        : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientAnswersQuery as any, {
    skip: (props: allProps) => !getPatientScreeningToolSubmissionId(props),
    options: (props: IProps) => ({
      variables: {
        filterType: 'patientScreeningToolSubmission',
        filterId: getPatientScreeningToolSubmissionId(props as allProps),
        patientId: props.match.params.patientId,
      },
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
    }),
  }),
)(ScreeningTool);
