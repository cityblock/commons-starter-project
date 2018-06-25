import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
import patientAnswersGraphql from '../../graphql/queries/get-patient-answers.graphql';
import getPatientScreeningToolSubmissionForPatientAndScreeningToolGraphql from '../../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
import progressNotesForCurrentUserGraphql from '../../graphql/queries/get-progress-notes-for-current-user.graphql';
import patientScreeningToolSubmissionScoreGraphql from '../../graphql/queries/patient-screening-tool-submission-score.graphql';
import {
  getPatientAnswers,
  patientScreeningToolSubmissionScore,
  patientScreeningToolSubmissionScoreVariables,
  FullCarePlanSuggestion,
  FullQuestion,
  FullScreeningTool,
} from '../../graphql/types';
import sortSearchStyles from '../../shared/css/sort-search.css';
import Button from '../../shared/library/button/button';
import Icon from '../../shared/library/icon/icon';
import Spinner from '../../shared/library/spinner/spinner';
import {
  allQuestionsAnswered,
  getQuestionAnswerHash,
  IQuestionAnswerHash,
} from '../../shared/question/question-helpers';
import styles from './css/screening-tool.css';
import ScreeningToolQuestions from './screening-tool-questions';

interface IProps {
  patientId: string;
  screeningTool: FullScreeningTool;
  screeningToolSubmissionId: string;
  screeningToolQuestions: FullQuestion[];
  onSubmissionScored?: (suggestions: FullCarePlanSuggestion[]) => void;
  isEditable: boolean;
}

interface IGraphqlProps {
  scoreScreeningToolSubmission: (
    options: { variables: patientScreeningToolSubmissionScoreVariables },
  ) => { data: patientScreeningToolSubmissionScore };
  patientAnswers?: getPatientAnswers['patientAnswers'];
  patientAnswersLoading?: boolean;
  patientAnswersError: ApolloError | undefined | null;
}

type allProps = IGraphqlProps & IProps;

export class ScreeningToolAssessment extends React.Component<allProps> {
  onSubmit = async () => {
    const {
      scoreScreeningToolSubmission,
      screeningToolQuestions,
      screeningToolSubmissionId,
      onSubmissionScored,
      patientAnswers,
    } = this.props;

    const questionAnswerHash = getQuestionAnswerHash(patientAnswers);
    const isAssessmentComplete = allQuestionsAnswered(
      screeningToolQuestions || [],
      questionAnswerHash,
    );
    if (!isAssessmentComplete) {
      return;
    }

    const result = await scoreScreeningToolSubmission({
      variables: {
        patientScreeningToolSubmissionId: screeningToolSubmissionId,
      },
    });

    const carePlanSuggestions =
      result.data && result.data.patientScreeningToolSubmissionScore
        ? result.data.patientScreeningToolSubmissionScore.carePlanSuggestions
        : [];

    if (onSubmissionScored) {
      onSubmissionScored(carePlanSuggestions);
    }
  };

  renderAssessment(updatedAnswerHash: IQuestionAnswerHash) {
    const {
      screeningTool,
      screeningToolQuestions,
      screeningToolSubmissionId,
      patientId,
      isEditable,
    } = this.props;
    const title = screeningTool ? screeningTool.title : 'Loading...';

    const titleStyles = classNames(styles.assessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    return (
      <div className={styles.assessment}>
        <div className={titleStyles}>
          <div className={styles.title}>
            <Icon name="event" />
            <div className={styles.titleText}>{title}</div>
          </div>
          <div className={styles.meta}>
            <div className={styles.lastUpdatedLabel}>Last updated:</div>
            <FormattedDate
              value={screeningTool.updatedAt}
              year="numeric"
              month="short"
              day="numeric"
            >
              {(date: string) => <div className={styles.lastUpdatedValue}>{date}</div>}
            </FormattedDate>
          </div>
        </div>
        <ScreeningToolQuestions
          patientId={patientId}
          screeningToolQuestions={screeningToolQuestions}
          screeningToolSubmissionId={screeningToolSubmissionId}
          answerHash={updatedAnswerHash}
          isEditable={isEditable}
        />
      </div>
    );
  }

  renderError() {
    const { patientAnswersError } = this.props;

    return patientAnswersError ? (
      <div className={styles.error}>
        <div className={styles.errorMessage}>
          <Icon name="addAlert" />
          <div className={styles.errorMessageText}>
            <div className={styles.errorMessageLabel}>Error loading answers for tool.</div>
          </div>
        </div>
      </div>
    ) : null;
  }

  render() {
    const {
      screeningToolQuestions,
      patientAnswersLoading,
      patientAnswers,
      isEditable,
    } = this.props;

    if (patientAnswersLoading) {
      return <Spinner />;
    }

    const questionAnswerHash = getQuestionAnswerHash(patientAnswers);
    const isAssessmentComplete = allQuestionsAnswered(
      screeningToolQuestions || [],
      questionAnswerHash,
    );
    const panelHtml = this.renderError() || this.renderAssessment(questionAnswerHash);

    const submitButtonStyles = classNames({
      [styles.disabled]: !isAssessmentComplete || !isEditable,
    });

    return (
      <React.Fragment>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <Button
            messageId="screeningTool.submit"
            className={submitButtonStyles}
            onClick={this.onSubmit}
          />
        </div>
        <div className={styles.panel}>{panelHtml}</div>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(patientScreeningToolSubmissionScoreGraphql, {
    name: 'scoreScreeningToolSubmission',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: getPatientScreeningToolSubmissionForPatientAndScreeningToolGraphql,
          variables: {
            patientId: props.patientId,
            screeningToolId: props.screeningTool.id,
            scored: false,
          },
        },
        {
          query: progressNotesForCurrentUserGraphql,
          variables: {
            completed: false,
          },
        },
      ],
    }),
  }),
  graphql(patientAnswersGraphql, {
    options: (props: IProps) => ({
      variables: {
        filterType: 'screeningTool',
        filterId: props.screeningToolSubmissionId,
        patientId: props.patientId,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      patientAnswersLoading: data ? data.loading : false,
      patientAnswersError: data ? data.error : null,
      patientAnswers: data ? (data as any).patientAnswers : null,
    }),
  }),
)(ScreeningToolAssessment) as React.ComponentClass<IProps>;
