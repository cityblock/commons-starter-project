import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as riskAreaQuestionsQuery from '../graphql/queries/get-questions-for-risk-area.graphql';
import * as riskAreaQuery from '../graphql/queries/get-risk-area.graphql';
import { FullQuestionFragment, FullRiskAreaFragment } from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from './css/risk-areas.css';
import RiskAreaQuestions from './risk-area-questions';

export interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  redirectToThreeSixty?: () => any;
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string;
  riskAreaQuestions?: FullQuestionFragment[];
  riskAreaQuestionsLoading?: boolean;
  riskAreaQuestionsError?: string;
}

export interface IState {
  inProgress: boolean;
}

class RiskAreaAssessment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onStart = this.onStart.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.state = { inProgress: false };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { error, redirectToThreeSixty } = nextProps;

    // The chosen RiskArea most likely does not exist
    if (error && redirectToThreeSixty) {
      redirectToThreeSixty();
    }
  }

  onStart() {
    this.setState(() => ({ inProgress: true }));
  }

  onCancel() {
    this.setState(() => ({ inProgress: false }));
  }

  render() {
    const { riskArea, riskAreaQuestions, patientId, riskAreaId } = this.props;
    const { inProgress } = this.state;

    const title = riskArea ? riskArea.title : 'Loading...';

    const cancelButtonStyles = classNames(styles.invertedButton, styles.cancelButton, {
      [styles.hidden]: !inProgress,
    });
    const saveButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.hidden]: !inProgress,
    });
    const startButtonStyles = classNames(styles.button, styles.startButton, {
      [styles.hidden]: inProgress,
    });
    const titleStyles = classNames(styles.riskAssessmentTitle, {
      [styles.lowRisk]: false,
      [styles.mediumRisk]: true,
      [styles.highRisk]: false,
    });

    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={cancelButtonStyles} onClick={this.onCancel}>Cancel</div>
          <div className={saveButtonStyles}>Save updates</div>
          <div className={startButtonStyles} onClick={this.onStart}>Start assessment</div>
        </div>
        <div className={styles.riskAreasPanel}>
          <div className={styles.riskAssessment}>
            <div className={titleStyles}>
              <div className={styles.title}>
                <div className={styles.titleIcon}></div>
                <div className={styles.titleText}>{title}</div>
              </div>
              <div className={styles.meta}>
                <div className={styles.lastUpdatedLabel}>Last updated:</div>
                <div className={styles.lastUpdatedValue}>1 week ago</div>
              </div>
            </div>
            <RiskAreaQuestions
              riskAreaQuestions={riskAreaQuestions}
              editing={inProgress}
              patientId={patientId}
              riskAreaId={riskAreaId} />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToThreeSixty: () => {
      dispatch(push(ownProps.routeBase));
    },
  };
}

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(riskAreaQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      riskArea: (data ? (data as any).riskArea : null),
    }),
  }),
  graphql(riskAreaQuestionsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
      },
    }),
    props: ({ data }) => ({
      riskAreaQuestionsLoading: (data ? data.loading : false),
      riskAreaQuestionsError: (data ? data.error : null),
      riskAreaQuestions: (data ? (data as any).questionsForRiskArea : null),
    }),
  }),
)(RiskAreaAssessment);
