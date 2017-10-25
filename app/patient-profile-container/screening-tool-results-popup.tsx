import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../graphql/queries/get-patient-screening-tool-submission.graphql';
/* tsline:enable:max-line-length */
import { FullPatientScreeningToolSubmissionFragment } from '../graphql/types';
import * as styles from './css/screening-tools-popup.css';

interface IProps {
  patientScreeningToolSubmissionId?: string;
  redirectToCarePlanSuggestions?: () => any;
  patientRoute: string;
  loading?: boolean;
  error?: string;
  patientScreeningToolSubmission?: FullPatientScreeningToolSubmissionFragment;
  refetchPatientScreeningToolSubmission?: () => any;
}

export class ScreeningToolResultsPopup extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.getConcernCount = this.getConcernCount.bind(this);
    this.getGoalSuggestions = this.getGoalSuggestions.bind(this);
    this.getGoalCount = this.getGoalCount.bind(this);
    this.getTaskCount = this.getTaskCount.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  getConcernCount() {
    const { patientScreeningToolSubmission } = this.props;

    if (!patientScreeningToolSubmission) {
      return 0;
    }

    const { carePlanSuggestions } = patientScreeningToolSubmission;

    if (!carePlanSuggestions.length) {
      return 0;
    }

    const concernSuggestions = carePlanSuggestions.filter(
      suggestion => suggestion!.suggestionType === 'concern',
    );

    return concernSuggestions.length;
  }

  getGoalSuggestions() {
    const { patientScreeningToolSubmission } = this.props;

    if (!patientScreeningToolSubmission) {
      return [];
    }

    const { carePlanSuggestions } = patientScreeningToolSubmission;

    if (!carePlanSuggestions.length) {
      return [];
    }

    return carePlanSuggestions.filter(suggestion => suggestion!.suggestionType === 'goal');
  }

  getGoalCount() {
    return this.getGoalSuggestions().length;
  }

  getTaskCount() {
    if (this.getGoalCount() === 0) {
      return 0;
    }

    const goalSuggestions = this.getGoalSuggestions();

    const taskSuggestions = goalSuggestions
      .map(goalSuggestion => goalSuggestion!.goalSuggestionTemplate!.taskTemplates)
      .reduce((taskSuggestions1, taskSuggestions2) => taskSuggestions1!.concat(taskSuggestions2));

    return (taskSuggestions || []).length;
  }

  onClick() {
    const { redirectToCarePlanSuggestions } = this.props;

    if (redirectToCarePlanSuggestions) {
      redirectToCarePlanSuggestions();
    }
  }

  render() {
    const suggestionsButtonStyles = classNames(styles.button, styles.smallButton);

    return (
      <div className={styles.screeningToolsPopupContent}>
        <div className={styles.screeningToolsPopupBody}>
          <div className={styles.screeningToolsPopupTitle}>New Care Plan Suggestions</div>
          <div className={classNames(styles.screeningToolsPopupSubtitle, styles.noMargin)}>
            Based on the results of this tool, the following have been recommended as additions to
            the patient's care plan.
          </div>
          <div className={styles.screeningToolResults}>
            <div className={styles.screeningToolResultRow}>
              <div className={styles.screeningToolResultLabel}>New Concerns</div>
              <div className={styles.screeningToolResultCount}>{this.getConcernCount()}</div>
            </div>
            <div className={styles.screeningToolResultRow}>
              <div className={styles.screeningToolResultLabel}>New Goals</div>
              <div className={styles.screeningToolResultCount}>{this.getGoalCount()}</div>
            </div>
            <div className={styles.screeningToolResultRow}>
              <div className={styles.screeningToolResultLabel}>New Tasks</div>
              <div className={styles.screeningToolResultCount}>{this.getTaskCount()}</div>
            </div>
          </div>
          <div className={styles.screeningToolsPopupButtons}>
            <div className={suggestionsButtonStyles} onClick={this.onClick}>
              See Suggestions
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToCarePlanSuggestions: () => {
      dispatch(push(`${ownProps.patientRoute}/carePlan/suggestions`));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(patientScreeningToolSubmissionQuery as any, {
    skip: (props: IProps) => !props.patientScreeningToolSubmissionId,
    options: (props: IProps) => ({
      variables: {
        patientScreeningToolSubmissionId: props.patientScreeningToolSubmissionId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      patientScreeningToolSubmission: data ? (data as any).patientScreeningToolSubmission : null,
      refetchPatientScreeningToolSubmission: data ? data.refetch : null,
    }),
  }),
)(ScreeningToolResultsPopup);
