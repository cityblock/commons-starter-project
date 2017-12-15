import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as riskAreaAssessmentSubmissionForPatientQuery from '../../graphql/queries/get-risk-area-assessment-submission-for-patient.graphql';
import * as riskAreaQuery from '../../graphql/queries/get-risk-area.graphql';
import * as riskAreaAssessmentSubmissionCompleteMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-complete-mutation.graphql';
import * as riskAreaAssessmentSubmissionCreateMutationGraphql from '../../graphql/queries/risk-area-assessment-submission-create-mutation.graphql';
/* tsline:enable:max-line-length */
import {
  riskAreaAssessmentSubmissionCompleteMutation,
  riskAreaAssessmentSubmissionCompleteMutationVariables,
  riskAreaAssessmentSubmissionCreateMutation,
  riskAreaAssessmentSubmissionCreateMutationVariables,
  FullRiskAreaAssessmentSubmissionFragment,
  FullRiskAreaFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../../shared/css/sort-search.css';
import { Popup } from '../../shared/popup/popup';
import ScreeningToolsPopup from '../screening-tool/screening-tools-popup';
import * as styles from './css/risk-areas.css';
import RiskAreaAssessmentQuestions from './risk-area-assessment-questions';

interface IProps {
  riskAreaId: string;
  patientId: string;
  routeBase: string;
  patientRoute: string;
}

interface IGraphqlProps {
  riskArea?: FullRiskAreaFragment;
  loading?: boolean;
  error?: string | null;
  riskAreaAssessmentSubmissionCreate?: (
    options: { variables: riskAreaAssessmentSubmissionCreateMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCreateMutation };
  riskAreaAssessmentSubmissionComplete?: (
    options: { variables: riskAreaAssessmentSubmissionCompleteMutationVariables },
  ) => { data: riskAreaAssessmentSubmissionCompleteMutation };
  riskAreaAssessmentSubmissionLoading?: boolean;
  riskAreaAssessmentSubmissionError: string | null;
  riskAreaAssessmentSubmission?: FullRiskAreaAssessmentSubmissionFragment;
}

type allProps = IGraphqlProps & IProps;

interface IState {
  inProgress: boolean;
  selectingScreeningTool: boolean;
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
      selectingScreeningTool: false,
    };
  }

  onStart = () => {
    const { riskAreaAssessmentSubmissionCreate, riskAreaId, patientId } = this.props;
    if (riskAreaAssessmentSubmissionCreate) {
      riskAreaAssessmentSubmissionCreate({
        variables: {
          riskAreaId,
          patientId,
        },
      });
      this.setState({ inProgress: true });
    }
  };

  onCancel = () => {
    this.setState({ inProgress: false });
  };

  onSubmit = async () => {
    const { riskAreaAssessmentSubmissionComplete, riskAreaAssessmentSubmission } = this.props;

    if (riskAreaAssessmentSubmission && riskAreaAssessmentSubmissionComplete) {
      await riskAreaAssessmentSubmissionComplete({
        variables: {
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
      });
      // TODO: Show care plan suggestions here
      this.onCancel();
    }
  };

  onClickToSelectScreeningTool = () => {
    this.setState({ selectingScreeningTool: true });
  };

  onDismissScreeningToolSelect = () => {
    this.setState({ selectingScreeningTool: false });
  };

  render() {
    const {
      riskArea,
      riskAreaId,
      patientId,
      routeBase,
      patientRoute,
      loading,
      error,
      riskAreaAssessmentSubmission,
    } = this.props;
    const { inProgress, selectingScreeningTool } = this.state;

    const toolsButtonStyles = classNames(styles.invertedButton, styles.toolsButton, {
      [styles.hidden]: inProgress,
    });
    const cancelButtonStyles = classNames(styles.invertedButton, styles.cancelButton, {
      [styles.hidden]: !inProgress,
    });
    const saveButtonStyles = classNames(styles.button, styles.saveButton, {
      [styles.hidden]: !inProgress,
    });
    const startButtonStyles = classNames(styles.button, styles.startButton, {
      [styles.hidden]: inProgress,
      [styles.disabled]: loading || error ? true : false,
    });
    const assessmentHtml = riskArea ? (
      <RiskAreaAssessmentQuestions
        riskArea={riskArea}
        routeBase={routeBase}
        patientRoute={patientRoute}
        patientId={patientId}
        inProgress={inProgress}
        riskAreaAssessmentSubmission={riskAreaAssessmentSubmission}
      />
    ) : null;
    return (
      <div>
        <div className={classNames(sortSearchStyles.sortSearchBar, styles.buttonBar)}>
          <div className={cancelButtonStyles} onClick={this.onCancel}>
            Cancel
          </div>
          <div className={toolsButtonStyles} onClick={this.onClickToSelectScreeningTool}>
            Administer tool
          </div>
          <div className={saveButtonStyles} onClick={this.onSubmit}>
            Save updates
          </div>
          <div className={startButtonStyles} onClick={this.onStart}>
            Start assessment
          </div>
        </div>
        <div className={styles.riskAreasPanel}>{assessmentHtml}</div>
        <Popup visible={selectingScreeningTool} style={'small-padding'}>
          <ScreeningToolsPopup
            riskAreaId={riskAreaId}
            onDismiss={this.onDismissScreeningToolSelect}
            patientRoute={patientRoute}
          />
        </Popup>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(
    riskAreaAssessmentSubmissionCompleteMutationGraphql as any,
    {
      name: 'riskAreaAssessmentSubmissionComplete',
    },
  ),
  graphql<IGraphqlProps, IProps, allProps>(
    riskAreaAssessmentSubmissionCreateMutationGraphql as any,
    {
      name: 'riskAreaAssessmentSubmissionCreate',
      options: { refetchQueries: ['getRiskAreaAssessmentSubmissionForPatient'] },
    },
  ),
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
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(riskAreaAssessmentSubmissionForPatientQuery as any, {
    skip: (props: IProps) => !props.riskAreaId,
    options: (props: IProps) => ({
      variables: {
        riskAreaId: props.riskAreaId,
        patientId: props.patientId,
        completed: false,
      },
    }),
    props: ({ data }) => ({
      riskAreaAssessmentSubmissionLoading: data ? data.loading : false,
      riskAreaAssessmentSubmissionError: data ? data.error : null,
      riskAreaAssessmentSubmission: data
        ? (data as any).riskAreaAssessmentSubmissionForPatient
        : null,
    }),
  }),
)(RiskAreaAssessment);
